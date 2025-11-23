# Docker Deployment Guide

## Building the Docker Image

### Using Docker
```bash
# Build the image
docker build -t ted-app:latest .

# Run the container
docker run -d -p 8080:80 --name ted-entertainment ted-app:latest

# View logs
docker logs ted-entertainment

# Stop the container
docker stop ted-entertainment

# Remove the container
docker rm ted-entertainment
```

### Using Docker Compose (Recommended)
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Accessing the Application

Once running, access the application at:
- **Local**: http://localhost:8080
- **Network**: http://YOUR_SERVER_IP:8080

## Health Check

The container includes a health check endpoint:
```bash
curl http://localhost:8080/health
```

## Configuration

### Port Mapping
To change the external port, modify the port mapping:
```bash
# Run on port 3000 instead of 8080
docker run -d -p 3000:80 ted-app:latest
```

Or in `docker-compose.yml`:
```yaml
ports:
  - "3000:80"
```

### Environment Variables
Add environment variables in `docker-compose.yml`:
```yaml
environment:
  - API_URL=https://your-api.com
```

## Production Deployment

### Using a Reverse Proxy (Recommended)

Example nginx reverse proxy configuration:
```nginx
server {
    listen 80;
    server_name ted.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### With SSL (HTTPS)
Use Certbot or similar to add SSL:
```bash
certbot --nginx -d ted.yourdomain.com
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs ted-entertainment

# Inspect container
docker inspect ted-entertainment
```

### Port already in use
```bash
# Find what's using the port
lsof -i :8080

# Use a different port
docker run -d -p 9090:80 ted-app:latest
```

### Image size too large
The multi-stage build should keep the image under 50MB. Check with:
```bash
docker images | grep ted-app
```

## Updating the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Cleanup

```bash
# Remove container
docker-compose down

# Remove image
docker rmi ted-app:latest

# Remove unused images
docker image prune -a
```
