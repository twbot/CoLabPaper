#!/bin/bash

# Stop and remove existing containers
docker-compose down

# Remove old logs
rm -f logs/*.log

# Rebuild and start the service
docker-compose up --build

# To view logs in real-time
# docker-compose logs -f latex-compiler