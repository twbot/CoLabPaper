# app/api/routes.py
from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Request, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from PIL import Image
import io
from datetime import datetime
import traceback
import logging

from app.latex_compiler import LatexCompiler
from app.config import settings

router = APIRouter()
logger = logging.getLogger("latex-service")

class CompilationRequest(BaseModel):
    tex_content: str
    project_id: str
    output_filename: str

class ImageMetadata(BaseModel):
    file_path: str
    url: str
    file_type: str
    size: int
    created_at: str
    name: str
    dimensions: Optional[dict] = None

async def validate_image(file: UploadFile) -> None:
    """Validate image file before processing"""
    logger.debug(f"Validating image: {file.filename} ({file.content_type})")
    
    # Check file type
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        logger.warning(f"Invalid file type: {file.content_type}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    
    # Check file size
    contents = await file.read()
    file_size = len(contents)
    await file.seek(0)  # Reset file pointer
    
    logger.debug(f"File size: {file_size / 1024 / 1024:.2f}MB")
    
    if file_size > settings.MAX_IMAGE_SIZE:
        logger.warning(f"File too large: {file_size / 1024 / 1024:.2f}MB")
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_IMAGE_SIZE / (1024 * 1024)}MB"
        )
    
    # Optionally validate and optimize image dimensions
    if settings.OPTIMIZE_IMAGES and file.content_type != 'application/pdf':
        try:
            img = Image.open(io.BytesIO(contents))
            width, height = img.size
            logger.debug(f"Image dimensions: {width}x{height}")
            
            if width > settings.MAX_IMAGE_DIMENSION or height > settings.MAX_IMAGE_DIMENSION:
                logger.warning(f"Image dimensions too large: {width}x{height}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Image dimensions too large. Maximum dimension: {settings.MAX_IMAGE_DIMENSION}px"
                )
        except Exception as e:
            logger.error(f"Error processing image dimensions: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error processing image: {str(e)}"
            )
    
    logger.debug("Image validation successful")

@router.get("/health")
async def health_check(request: Request):
    """Health check endpoint"""
    logger.debug("Health check requested")
    storage_type = "local" if settings.IS_LOCAL else "supabase"
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "storage": storage_type,
        "timestamp": datetime.now().isoformat()
    }

@router.post("/upload-image/{project_id}")
async def upload_image(
    request: Request,
    project_id: str,
    file: UploadFile = File(...),
    optimize: bool = Query(False, description="Whether to optimize the image before saving")
) -> ImageMetadata:
    """Upload an image file"""
    try:
        logger.info(f"Starting image upload for project {project_id}")
        logger.debug(f"File details - name: {file.filename}, content_type: {file.content_type}")
        
        # Validate image
        await validate_image(file)
        logger.debug("Image validation passed")
        
        storage_provider = request.app.state.storage_provider
        
        # Get original file extension
        _, ext = os.path.splitext(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        new_filename = f"img_{timestamp}{ext}"
        
        logger.debug(f"Saving image with filename: {new_filename}")
        
        # Save image using storage provider
        file_path, url = await storage_provider.save_image(
            file,
            project_id,
            new_filename,
            optimize=optimize
        )
        
        logger.debug(f"Image saved successfully at {file_path}")
        
        # Get image dimensions if possible
        dimensions = None
        if file.content_type != 'application/pdf':
            contents = await file.read()
            await file.seek(0)
            try:
                with Image.open(io.BytesIO(contents)) as img:
                    dimensions = {"width": img.width, "height": img.height}
                logger.debug(f"Image dimensions: {dimensions}")
            except Exception as e:
                logger.warning(f"Could not get image dimensions: {e}")

        response = ImageMetadata(
            file_path=file_path,
            url=url,
            file_type=file.content_type,
            size=file.size if hasattr(file, 'size') else 0,
            created_at=datetime.now().isoformat(),
            name=new_filename,
            dimensions=dimensions
        )
        
        logger.info(f"Successfully uploaded image {new_filename} for project {project_id}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during image upload: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/images/{project_id}")
async def list_images(
    request: Request,
    project_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
) -> dict:
    """List all images for a project"""
    logger.info(f"Listing images for project {project_id} (page {page}, limit {limit})")
    try:
        storage_provider = request.app.state.storage_provider
        images = await storage_provider.list_images(project_id, skip=(page-1)*limit, limit=limit)
        total = await storage_provider.count_images(project_id)
        
        logger.debug(f"Found {total} total images, returning {len(images)} for current page")
        
        return {
            "status": "success",
            "images": images,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        logger.error(f"Error listing images: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/images/{project_id}/{image_path:path}")
async def delete_image(
    request: Request,
    project_id: str,
    image_path: str
) -> dict:
    """Delete an image"""
    logger.info(f"Deleting image {image_path} from project {project_id}")
    try:
        storage_provider = request.app.state.storage_provider
        success = await storage_provider.delete_image(project_id, image_path)
        
        if not success:
            logger.warning(f"Image not found: {image_path}")
            raise HTTPException(status_code=404, detail="Image not found")
            
        logger.info(f"Successfully deleted image {image_path}")
        return {
            "status": "success",
            "message": "Image deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting image: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compile")
async def compile_document(
    request: Request,
    compilation_request: CompilationRequest,
    background_tasks: BackgroundTasks
) -> dict:
    """Compile LaTeX document"""
    logger.info(f"Starting LaTeX compilation for project {compilation_request.project_id}")
    try:
        storage_provider = request.app.state.storage_provider
        compiler = LatexCompiler(storage_provider)
        
        logger.debug("Initializing compilation process")
        # Compile the document
        try:
            pdf_path = await compiler.compile(
                compilation_request.tex_content,
                compilation_request.project_id
            )
        except HTTPException as he:
            # Log the detailed error and return it to the client
            logger.error(f"LaTeX compilation failed:\n{he.detail.get('log', '')}")
            raise

        logger.debug(f"Compilation successful, saving PDF to storage: {compilation_request.output_filename}")
        # Save to storage
        file_path, url = await storage_provider.save_pdf(
            pdf_path,
            compilation_request.project_id,
            compilation_request.output_filename
        )
        
        logger.debug("Scheduling cleanup task")
        # Schedule cleanup in background
        background_tasks.add_task(compiler.cleanup_old_files)
        
        logger.info(f"Successfully compiled document for project {compilation_request.project_id}")
        return {
            "status": "success",
            "file_path": file_path,
            "url": url,
            "storage_type": "local" if settings.IS_LOCAL else "supabase",
            "compiled_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during compilation: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Internal server error during compilation",
                "error": str(e)
            }
        )

@router.get("/compile/status/{project_id}/{filename}")
async def get_compilation_status(
    request: Request,
    project_id: str,
    filename: str
) -> dict:
    """Get status of compiled PDF"""
    logger.info(f"Checking compilation status for {filename} in project {project_id}")
    try:
        storage_provider = request.app.state.storage_provider
        exists = await storage_provider.check_pdf_exists(project_id, filename)
        
        if not exists:
            logger.debug(f"PDF not found: {filename}")
            return {
                "status": "not_found",
                "exists": False
            }
            
        url = await storage_provider.get_pdf_url(project_id, filename)
        logger.debug(f"PDF found with URL: {url}")
        
        return {
            "status": "success",
            "exists": True,
            "url": url
        }
    except Exception as e:
        logger.error(f"Error checking compilation status: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/config")
async def get_config() -> dict:
    """Get public configuration settings"""
    logger.debug("Retrieving public configuration settings")
    return {
        "max_image_size_mb": settings.MAX_IMAGE_SIZE / (1024 * 1024),
        "allowed_image_types": settings.ALLOWED_IMAGE_TYPES,
        "max_image_dimension": settings.MAX_IMAGE_DIMENSION,
        "storage_type": "local" if settings.IS_LOCAL else "supabase",
        "optimize_images": settings.OPTIMIZE_IMAGES
    }