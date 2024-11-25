import os
import shutil
from pathlib import Path
import aiofiles
from typing import List, Tuple, Dict
from datetime import datetime
from fastapi import UploadFile
from abc import ABC, abstractmethod
from supabase import Client
import logging

logger = logging.getLogger("latex-service")

class StorageProvider(ABC):
    @abstractmethod
    async def list_images(self, project_id: str) -> List[Dict]:
        """List all files for a project"""
        pass

    @abstractmethod
    async def save_image(self, file: UploadFile, project_id: str) -> Tuple[str, str]:
        """Save an image and return (file_path, url)"""
        pass

    @abstractmethod
    async def save_pdf(self, pdf_path: Path, project_id: str, filename: str) -> Tuple[str, str]:
        """Save PDF and return (file_path, url)"""
        pass

    @abstractmethod
    async def get_image_url(self, file_path: str) -> str:
        """Get URL for an existing image"""
        pass

    @abstractmethod
    async def check_pdf_exists(self, project_id: str, filename: str) -> bool:
        """Check if a PDF exists"""
        pass

    @abstractmethod
    async def get_pdf_url(self, project_id: str, filename: str) -> str:
        """Get URL for an existing PDF"""
        pass

    @abstractmethod
    async def delete_image(self, project_id: str, image_path: str) -> bool:
        """Delete an image"""
        pass

    @abstractmethod
    async def count_images(self, project_id: str) -> int:
        """Count total images for a project"""
        pass

class LocalStorageProvider(StorageProvider):
    def __init__(self, base_dir: str = "storage"):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_project_dir(self, project_id: str) -> Path:
        project_dir = self.base_dir / project_id
        project_dir.mkdir(parents=True, exist_ok=True)
        return project_dir

    async def list_images(self, project_id: str, skip: int = 0, limit: int = 50) -> List[Dict]:
        """List all files for a project"""
        try:
            project_dir = self._get_project_dir(project_id)
            
            files = []
            for path in project_dir.rglob("*"):
                if path.is_file():
                    rel_path = path.relative_to(self.base_dir)
                    stats = path.stat()
                    files.append({
                        "name": path.name,
                        "path": str(rel_path),
                        "size": stats.st_size,
                        "modified": datetime.fromtimestamp(stats.st_mtime).isoformat(),
                        "url": f"/storage/{rel_path}"
                    })

            return files[skip:skip + limit]
        except Exception as e:
            logger.error(f"Error listing files for project {project_id}: {str(e)}")
            return []

    async def save_image(self, file: UploadFile, project_id: str, filename: str = None, optimize: bool = False) -> Tuple[str, str]:
        try:
            project_dir = self._get_project_dir(project_id)
            images_dir = project_dir / "images"
            images_dir.mkdir(exist_ok=True)

            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                ext = os.path.splitext(file.filename)[1]
                filename = f"img_{timestamp}{ext}"

            file_path = images_dir / filename

            async with aiofiles.open(file_path, 'wb') as f:
                while chunk := await file.read(8192):
                    await f.write(chunk)

            rel_path = file_path.relative_to(self.base_dir)
            url = f"/storage/{rel_path}"

            return str(rel_path), url

        except Exception as e:
            logger.error(f"Error saving image: {str(e)}")
            raise

    async def save_pdf(self, pdf_path: Path, project_id: str, filename: str) -> Tuple[str, str]:
        try:
            project_dir = self._get_project_dir(project_id)
            target_path = project_dir / filename

            shutil.copy2(pdf_path, target_path)

            rel_path = target_path.relative_to(self.base_dir)
            url = f"/storage/{rel_path}"

            return str(rel_path), url

        except Exception as e:
            logger.error(f"Error saving PDF: {str(e)}")
            raise

    async def get_image_url(self, file_path: str) -> str:
        return f"/storage/{file_path}"

    async def check_pdf_exists(self, project_id: str, filename: str) -> bool:
        project_dir = self._get_project_dir(project_id)
        pdf_path = project_dir / filename
        return pdf_path.exists()

    async def get_pdf_url(self, project_id: str, filename: str) -> str:
        return f"/storage/{project_id}/{filename}"

    async def delete_image(self, project_id: str, image_path: str) -> bool:
        try:
            file_path = self.base_dir / image_path
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting image: {str(e)}")
            return False

    async def count_images(self, project_id: str) -> int:
        try:
            project_dir = self._get_project_dir(project_id)
            return len(list(project_dir.rglob("*")))
        except Exception as e:
            logger.error(f"Error counting images: {str(e)}")
            return 0

class SupabaseStorageProvider(StorageProvider):
    def __init__(self, supabase_client: Client, bucket_name: str = "pdfs"):
        self.supabase = supabase_client
        self.bucket_name = bucket_name

    async def save_pdf(self, pdf_path: Path, project_id: str, filename: str) -> Tuple[str, str]:
        bucket_path = f"{project_id}/{filename}"
        
        with pdf_path.open('rb') as pdf_file:
            self.supabase.storage.from_(self.bucket_name).upload(
                bucket_path,
                pdf_file,
                {"upsert": True}
            )
        
        url = self.supabase.storage.from_(self.bucket_name).create_signed_url(
            bucket_path,
            60 * 60  # 1 hour expiry
        )
        
        return bucket_path, url

    async def save_image(self, image: UploadFile, project_id: str) -> Tuple[str, str]:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        _, ext = os.path.splitext(image.filename)
        filename = f"img_{timestamp}{ext}"
        
        bucket_path = f"{project_id}/images/{filename}"
        
        # Read the file content
        content = await image.read()
        
        # Upload to Supabase
        self.supabase.storage.from_(self.bucket_name).upload(
            bucket_path,
            content,
            {"upsert": True}
        )
        
        url = self.supabase.storage.from_(self.bucket_name).create_signed_url(
            bucket_path,
            60 * 60 * 24 * 7  # 7 days expiry for images
        )
        
        return bucket_path, url

    async def get_image_url(self, file_path: str) -> str:
        return self.supabase.storage.from_(self.bucket_name).create_signed_url(
            file_path,
            60 * 60 * 24 * 7  # 7 days expiry for images
        )