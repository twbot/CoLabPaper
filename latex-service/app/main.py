# app/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
import os
from typing import Union
import sys

from app.config import settings
from app.api.routes import router
from app.storage import LocalStorageProvider, SupabaseStorageProvider
from app.logging_config import setup_logging
from supabase import create_client

# Setup logging
logger = setup_logging()

app = FastAPI(title="LaTeX Compilation Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global error handler for all routes"""
    # Log the error with full traceback
    error_msg = f"Unhandled exception in {request.url.path}: {str(exc)}\n{''.join(traceback.format_tb(exc.__traceback__))}"
    logger.error(error_msg)
    
    # Return a structured error response
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__,
            "path": request.url.path,
            "method": request.method,
            "error": str(exc) if settings.ENV == "development" else "Internal server error"
        }
    )

# Exception handler specifically for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handler for HTTP exceptions"""
    logger.warning(f"HTTP exception in {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "type": "HTTPException",
            "path": request.url.path
        }
    )

# Initialize storage provider with error handling
try:
    if settings.IS_LOCAL:
        logger.info("Initializing local storage provider")
        storage_provider = LocalStorageProvider(settings.LOCAL_STORAGE_DIR)
        # Mount local storage directory for direct file access
        app.mount("/storage", StaticFiles(directory=settings.LOCAL_STORAGE_DIR), name="storage")
    else:
        logger.info("Initializing Supabase storage provider")
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        storage_provider = SupabaseStorageProvider(supabase, settings.PDF_BUCKET_NAME)

    # Add storage provider to app state
    app.state.storage_provider = storage_provider
except Exception as e:
    logger.error(f"Failed to initialize storage provider: {str(e)}\n{''.join(traceback.format_tb(e.__traceback__))}")
    raise

# Include routes
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("Starting LaTeX Compilation Service")
    # Log configuration
    logger.info(f"Environment: {settings.ENV}")
    logger.info(f"Storage Type: {'Local' if settings.IS_LOCAL else 'Supabase'}")
    logger.info(f"Storage Directory: {settings.LOCAL_STORAGE_DIR}")
    logger.info(f"Max Image Size: {settings.MAX_IMAGE_SIZE / (1024 * 1024)}MB")

    # Ensure required directories exist
    os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    logger.info("Required directories created/verified")

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("Shutting down LaTeX Compilation Service")
    # Add any cleanup code here if needed

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug"
    )