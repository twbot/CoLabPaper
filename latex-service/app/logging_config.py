# app/logging_config.py
import logging
import sys
from pathlib import Path

def setup_logging():
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    # Configure logging
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # Console handler with DEBUG level
            logging.StreamHandler(sys.stdout),
            # File handler with ERROR level
            logging.FileHandler(log_dir / "error.log"),
        ]
    )

    # Set uvicorn access logger level
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    
    # Create logger for our application
    logger = logging.getLogger("latex-service")
    return logger