# Use Ubuntu as base image
FROM ubuntu:22.04

# Prevent tzdata from asking for geographic area
ENV DEBIAN_FRONTEND=noninteractive

# Install Python and basic requirements
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    python3.10-venv \
    && rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /app

# Copy installation script and run it
COPY scripts/install_texlive.sh /tmp/
RUN chmod +x /tmp/install_texlive.sh && /tmp/install_texlive.sh

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Set up TEXMF directory
ENV TEXMFHOME=/texmf
RUN mkdir -p /texmf/tex/latex

# Copy application code
COPY app/ app/

# Update TeX database
RUN texhash /texmf

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]