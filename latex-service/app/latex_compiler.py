# app/latex_compiler.py
import os
import re
import subprocess
import tempfile
from pathlib import Path
import shutil
from typing import Optional, List, Dict, Tuple
import asyncio
from datetime import datetime
import logging
import aiohttp
import aiofiles
from fastapi import HTTPException

from app.storage import StorageProvider
from app.config import settings

logger = logging.getLogger("latex-service")

class LatexCompilationError(Exception):
    """Custom exception for LaTeX compilation errors"""
    def __init__(self, message: str, log_content: str):
        self.message = message
        self.log_content = log_content
        super().__init__(self.message)

class LatexCompiler:
    def __init__(self, storage_provider: StorageProvider, temp_dir: str = "/tmp/latex"):
        self.storage_provider = storage_provider
        self.temp_dir = Path(temp_dir)
        self.texmf_dir = Path("/texmf/tex/latex")  # Local TEXMF directory
        os.makedirs(temp_dir, exist_ok=True)
        os.makedirs(self.texmf_dir, exist_ok=True)

    async def _prepare_class_files(self, work_dir: Path, project_id: str) -> None:
        """Copy required class files to the working directory"""
        logger.debug("Preparing class files")
        try:
            # Get list of class files
            cls_response = await self.storage_provider.list_images(project_id)  # This should list class files too
            class_files = [f for f in cls_response if f.name.endswith('.cls')]

            for cls_file in class_files:
                # Get the class file content
                response = await fetch(f"/api/cls/{cls_file.name}")
                if response.ok:
                    content = await response.text()
                    
                    # Write to both working directory and texmf directory
                    cls_paths = [
                        work_dir / cls_file.name,
                        self.texmf_dir / cls_file.name
                    ]
                    
                    for cls_path in cls_paths:
                        async with aiofiles.open(cls_path, 'w') as f:
                            await f.write(content)
                            logger.debug(f"Wrote class file to {cls_path}")

            # Run texhash to update the database
            process = await asyncio.create_subprocess_exec(
                "texhash",
                str(self.texmf_dir),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            logger.debug("Updated TeX database")

        except Exception as e:
            logger.error(f"Error preparing class files: {str(e)}")
            raise

    async def _download_image(self, url: str, target_path: Path) -> None:
        """Download image from URL to target path"""
        try:
            logger.debug(f"Downloading image from {url} to {target_path}")
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        raise Exception(f"Failed to download image: {url}, status: {response.status}")
                    
                    async with aiofiles.open(target_path, 'wb') as f:
                        await f.write(await response.read())
            logger.debug(f"Successfully downloaded image to {target_path}")
        except Exception as e:
            logger.error(f"Error downloading image {url}: {str(e)}")
            raise

    async def _process_images(self, tex_content: str, work_dir: Path, project_id: str) -> str:
        """Process images in TeX content and return updated content"""
        logger.debug("Processing images in LaTeX content")
        
        # Regular expression to find image inclusions
        image_pattern = r'\\includegraphics(?:\[.*?\])?\{(.*?)\}'
        
        async def process_match(match) -> str:
            image_path = match.group(1)
            logger.debug(f"Processing image reference: {image_path}")
            
            try:
                # If it's a URL or storage path, download the image
                if image_path.startswith(('http://', 'https://', 'storage/', project_id)):
                    # Get the URL for the image
                    if image_path.startswith(('storage/', project_id)):
                        logger.debug(f"Getting URL for storage path: {image_path}")
                        image_url = await self.storage_provider.get_image_url(image_path)
                    else:
                        image_url = image_path
                    
                    # Generate local filename
                    ext = os.path.splitext(image_path)[1] or '.png'
                    local_filename = f"img_{hash(image_path)}{ext}"
                    local_path = work_dir / local_filename
                    
                    # Download the image
                    await self._download_image(image_url, local_path)
                    logger.debug(f"Image downloaded and saved as {local_filename}")
                    
                    # Return the local path for LaTeX
                    return f"\\includegraphics{{{local_filename}}}"
                
                logger.debug(f"Using original image path: {image_path}")
                return match.group(0)
            except Exception as e:
                logger.error(f"Error processing image {image_path}: {str(e)}")
                raise Exception(f"Failed to process image {image_path}: {str(e)}")

        # Process all image references
        positions = []
        for match in re.finditer(image_pattern, tex_content):
            positions.append((match.start(), match.end(), match.group(1)))

        # Process images concurrently
        if positions:
            logger.debug(f"Found {len(positions)} images to process")
            new_strings = await asyncio.gather(
                *(process_match(match) for match in re.finditer(image_pattern, tex_content))
            )
            
            # Replace all matches with processed strings
            result = list(tex_content)
            for (start, end, _), new_string in zip(positions[::-1], new_strings[::-1]):
                result[start:end] = new_string
            
            tex_content = ''.join(result)
            logger.debug("Finished processing all images")

        return tex_content

    async def _parse_latex_log(self, log_path: Path) -> str:
        """Parse LaTeX log file and extract relevant error information"""
        if not log_path.exists():
            return "No log file found"

        try:
            async with aiofiles.open(log_path, 'r', encoding='utf-8', errors='replace') as f:
                content = await f.read()

            # Extract error messages
            error_pattern = r'!(.*?)l\.\d+'
            errors = re.findall(error_pattern, content, re.DOTALL)
            
            # Extract warnings
            warning_pattern = r'Warning:(.*?)$'
            warnings = re.findall(warning_pattern, content, re.MULTILINE)

            parsed_log = "=== LaTeX Compilation Log ===\n"
            
            if errors:
                parsed_log += "\nErrors:\n"
                for error in errors:
                    parsed_log += f"- {error.strip()}\n"
            
            if warnings:
                parsed_log += "\nWarnings:\n"
                for warning in warnings:
                    parsed_log += f"- {warning.strip()}\n"

            return parsed_log
        except Exception as e:
            logger.error(f"Error parsing LaTeX log: {str(e)}")
            return "Error parsing log file"

    async def _run_pdflatex(self, tex_file: Path, work_dir: Path) -> Tuple[bool, str]:
        """Run pdflatex and capture output"""
        try:
            logger.debug(f"Running pdflatex on {tex_file.name}")
            process = await asyncio.create_subprocess_exec(
                "pdflatex",
                "-interaction=nonstopmode",
                "-file-line-error",
                tex_file.name,
                cwd=str(work_dir),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()
            
            # Log the raw output
            logger.debug("pdflatex stdout:")
            logger.debug(stdout.decode('utf-8', errors='replace'))
            if stderr:
                logger.debug("pdflatex stderr:")
                logger.debug(stderr.decode('utf-8', errors='replace'))

            # Parse the log file
            log_file = work_dir / f"{tex_file.stem}.log"
            log_content = await self._parse_latex_log(log_file)
            
            if process.returncode != 0:
                logger.error("pdflatex compilation failed")
                logger.error(log_content)
                return False, log_content
            
            return True, log_content

        except Exception as e:
            error_msg = f"Error running pdflatex: {str(e)}"
            logger.error(error_msg)
            return False, error_msg

    async def compile(self, tex_content: str, project_id: str, timeout: Optional[int] = None) -> Path:
        """Compile LaTeX content with images and return path to PDF"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        work_dir = Path(self.temp_dir) / f"compile_{timestamp}"
        work_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"Starting LaTeX compilation for project {project_id}")
        logger.debug(f"Working directory: {work_dir}")

        try:
            # Prepare class files before compilation
            await self._prepare_class_files(work_dir, project_id)

            # Process images in the content
            logger.debug("Processing images in content")
            tex_content = await self._process_images(tex_content, work_dir, project_id)

            # Write TEX content to file
            tex_file = work_dir / "document.tex"
            async with aiofiles.open(tex_file, 'w') as f:
                await f.write(tex_content)
            logger.debug(f"LaTeX content written to {tex_file}")

            # Set TEXMFHOME environment variable
            os.environ['TEXMFHOME'] = str(self.texmf_dir.parent)

            # Run pdflatex with proper environment
            for compilation_pass in range(2):
                logger.debug(f"Starting compilation pass {compilation_pass + 1}/2")
                
                success, log_content = await self._run_pdflatex(tex_file, work_dir)
                if not success:
                    raise LatexCompilationError(
                        "LaTeX compilation failed",
                        log_content
                    )

            pdf_path = work_dir / "document.pdf"
            if not pdf_path.exists():
                raise LatexCompilationError(
                    "PDF was not generated",
                    "No PDF output file found after compilation"
                )

            # Move to final location
            output_path = Path(self.temp_dir) / f"output_{timestamp}.pdf"
            shutil.move(pdf_path, output_path)
            logger.info(f"Compilation successful, PDF saved to {output_path}")
            
            return output_path

        except Exception as e:
            logger.error(f"Compilation error: {str(e)}")
            raise
        finally:
            # Clean up temporary directory
            try:
                shutil.rmtree(work_dir)
                logger.debug(f"Cleaned up working directory: {work_dir}")
            except Exception as e:
                logger.warning(f"Error cleaning up working directory: {str(e)}")
                
    @staticmethod
    async def cleanup_old_files(max_age_hours: int = 24):
        """Clean up old temporary files"""
        try:
            current_time = datetime.now().timestamp()
            temp_dir = Path(settings.TEMP_DIR)
            
            for file in temp_dir.glob("output_*.pdf"):
                if (current_time - file.stat().st_mtime) > (max_age_hours * 3600):
                    file.unlink()
                    logger.debug(f"Cleaned up old file: {file}")
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")