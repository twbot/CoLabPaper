# app/config.py
import os
from typing import List
from dotenv import load_dotenv

load_dotenv(override=True)

class Settings:
    # Environment settings
    ENV = os.getenv("ENV", "development")
    IS_LOCAL = ENV == "development"

    # Supabase settings
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    PDF_BUCKET_NAME = os.getenv("PDF_BUCKET_NAME", "pdfs")
    
    # Storage settings
    LOCAL_STORAGE_DIR = os.getenv("LOCAL_STORAGE_DIR", "storage")
    TEMP_DIR = os.getenv("TEMP_DIR", "/tmp/latex")
    
    # Compilation settings
    MAX_COMPILATION_TIME = int(os.getenv("MAX_COMPILATION_TIME", "300"))
    
    # Image settings
    MAX_IMAGE_SIZE = int(os.getenv("MAX_IMAGE_SIZE", "10")) * 1024 * 1024  # Default 10MB
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf"  # For vector graphics
    ]
    IMAGE_STORAGE_PATH = os.getenv("IMAGE_STORAGE_PATH", "images")  # Subfolder for images
    
    # Image processing settings
    OPTIMIZE_IMAGES = os.getenv("OPTIMIZE_IMAGES", "false").lower() == "true"
    MAX_IMAGE_DIMENSION = int(os.getenv("MAX_IMAGE_DIMENSION", "2000"))  # Max width/height
    
    @property
    def image_storage_dir(self) -> str:
        """Get the full path for image storage"""
        return os.path.join(self.LOCAL_STORAGE_DIR, self.IMAGE_STORAGE_PATH)

settings = Settings()

# Create necessary directories
os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)
os.makedirs(settings.image_storage_dir, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)