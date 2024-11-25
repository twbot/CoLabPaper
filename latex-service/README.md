# LaTeX Compilation Service

A FastAPI-based service that compiles LaTeX documents with image support and stores the resulting PDFs either locally or in Supabase storage. Perfect for development and production environments.

## Features

- Async LaTeX compilation with timeout protection
- Dual storage support:
  - Local file storage for development
  - Supabase storage for production
- Automatic cleanup of temporary files
- Docker support for easy deployment
- Health check endpoint
- Configurable settings via environment variables
- Project-based PDF organization

## Prerequisites

- Docker and Docker Compose
- For production: Supabase account with storage bucket configured
- TeX Live packages (automatically installed in Docker)

## Project Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── README.md
├── scripts/
│   └── install_texlive.sh
└── src/
    ├── __init__.py
    ├── main.py
    ├── config.py
    ├── latex_compiler.py
    └── storage.py
```

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd latex-compiler-service
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
```

3. For local development:
```bash
# Set in .env
ENV=development
LOCAL_STORAGE_DIR=storage
```

4. For production:
```bash
# Set in .env
ENV=production
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

5. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The service will be available at http://localhost:8000

## Storage Modes

### Local Storage (Development)
- PDFs are stored in the `storage/` directory
- Files are organized by project: `storage/<project_id>/<filename>.pdf`
- Access files via `http://localhost:8000/storage/<project_id>/<filename>.pdf`
- Perfect for development and testing

### Supabase Storage (Production)
- PDFs are stored in your Supabase bucket
- Files are organized by project: `<project_id>/<filename>.pdf`
- Secure signed URLs for file access
- Ideal for production deployment

## API Endpoints

### Health Check
```
GET /health
Response:
{
    "status": "healthy",
    "mode": "local|production",
    "storage": "local|supabase"
}
```

### Upload Image
```
POST /upload-image/{project_id}
Content-Type: multipart/form-data

file: <image_file>

Response:
{
    "status": "success",
    "file_path": "path/to/image",
    "url": "access_url"
}
```

### Compile LaTeX
```
POST /compile
Content-Type: application/json

{
    "tex_content": "\\documentclass{article}...",
    "project_id": "project-123",
    "output_filename": "document.pdf"
}

Response:
{
    "status": "success",
    "file_path": "path/to/file",
    "url": "access_url",
    "storage_type": "local|supabase"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| ENV | Environment (development/production) | development |
| SUPABASE_URL | Supabase project URL | required in production |
| SUPABASE_KEY | Supabase service role key | required in production |
| PDF_BUCKET_NAME | Supabase storage bucket name | pdfs |
| LOCAL_STORAGE_DIR | Local storage directory | storage |
| MAX_COMPILATION_TIME | Max compilation time in seconds | 300 |
| TEMP_DIR | Directory for temporary files | /tmp/latex |
| IMAGE_STORAGE_DIR | Local image storage directory | storage/images |
| MAX_IMAGE_SIZE | Maximum image size in MB | 10 |


## Image Support

The service supports handling images in LaTeX documents through two main workflows:

1. **Upload & Reference**: Upload images first, then reference them in LaTeX
2. **Direct URL**: Use direct URLs in LaTeX (automatically downloaded during compilation)

### Image Storage

- **Local Mode**: Images stored in `storage/<project_id>/images/`
- **Production Mode**: Images stored in Supabase bucket under `<project_id>/images/`
- Automatic organization by project
- Unique filename generation to prevent conflicts

## Image Guidelines

- Supported formats: PNG, JPEG, PDF
- Maximum file size: 10MB (configurable)
- Recommended formats for best results:
  - Photos: JPEG
  - Diagrams/Charts: PNG
  - Vector Graphics: PDF

## Next.js Integration

1. Create an API route in your Next.js project:

```typescript
// src/app/api/compile-latex/route.ts
import { NextResponse } from 'next/server'

const LATEX_SERVICE_URL = process.env.LATEX_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await fetch(`${LATEX_SERVICE_URL}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
```

2. Use in your frontend:

```typescript
const response = await fetch('/api/compile-latex', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    texContent: '\\documentclass{article}...',
    projectId: 'project-123',
    filename: 'document.pdf'
  })
})

const result = await response.json()
console.log(result.url) // Access the compiled PDF
```

## Development

### Adding New LaTeX Packages

1. Update `scripts/install_texlive.sh`:
```bash
apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-science \
    your-new-package
```

2. Rebuild the Docker image:
```bash
docker-compose build --no-cache
```

### Local Development Without Docker

1. Install system dependencies:
```bash
sudo apt-get update
sudo apt-get install -y texlive-latex-base texlive-latex-extra
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Run the service:
```bash
python -m uvicorn app.main:app --reload
```

## Deployment

### Using Docker

1. Build the image:
```bash
docker build -t latex-compiler .
```

2. Run in production:
```bash
docker run -d \
  -p 8000:8000 \
  --env-file .env \
  --name latex-compiler \
  latex-compiler
```

### Using Docker Compose

1. Update environment variables in `.env`
2. Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring

- Health check endpoint: `GET /health`
- Docker health check is configured
- Logs available via `docker logs latex-compiler`

## Troubleshooting

### Common Image Issues

1. **Image Not Found**
   - Check if the image path is correct
   - Verify image was uploaded successfully
   - Check storage permissions

2. **Compilation Errors with Images**
   - Ensure `\usepackage{graphicx}` is included
   - Check image file format compatibility
   - Verify image file is not corrupted

3. **Image Quality Issues**
   - Use appropriate format for image type
   - Check original image resolution
   - Consider using PDF format for vector graphics

### Debug Mode

Set `LOG_LEVEL=debug` in `.env` for detailed logging:
```bash
LOG_LEVEL=debug
```

## Debugging
- Check general application logs
```bash
docker-compose logs -f latex-compiler
```

- Check error logs specifically:
```bash
tail -f logs/error.log
```

- Filter logs by severity:
```bash
docker-compose logs -f latex-compiler | grep "ERROR"
```

- Search for specific operations:
```bash
docker-compose logs -f latex-compiler | grep "Compiling"
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.