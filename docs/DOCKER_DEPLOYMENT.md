# Docker Deployment Guide

## Quick Start

### Building the Image

```bash
docker build -t ted-app .
```

### Running the Container

The key advantage of the new Node.js-based setup is that you can now configure the RDT Client URL at runtime without rebuilding the image:

```bash
docker run -d \
  -p 80:80 \
  -e VITE_RDT_CLIENT_URL=http://192.168.1.100:6500 \
  --name ted \
  ted-app
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RDT_CLIENT_URL` | URL to your RDT Client instance | `http://localhost:6500` |
| `PORT` | Port the server listens on | `80` |

## Examples

### Local Testing

```bash
# Build
docker build -t ted-app .

# Run with custom RDT Client URL
docker run -p 8080:80 \
  -e VITE_RDT_CLIENT_URL=http://192.168.1.50:6500 \
  ted-app
```

### Production Deployment

```bash
# Using docker-compose
version: '3.8'
services:
  ted:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_RDT_CLIENT_URL=http://192.168.1.100:6500
    restart: unless-stopped
```

### Updating Configuration

To change the RDT Client URL, simply restart the container with a new environment variable:

```bash
# Stop the container
docker stop ted

# Start with new URL
docker run -d \
  -p 80:80 \
  -e VITE_RDT_CLIENT_URL=http://192.168.1.200:6500 \
  --name ted \
  ted-app
```

No rebuild required! 🎉

## Verifying the Setup

Check the logs to see configured proxies:

```bash
docker logs ted
```

You should see output like:
```
🚀 Starting server...
📡 RDT Client URL: http://192.168.1.100:6500
✅ Server running on http://0.0.0.0:80
📁 Serving static files from: /app/dist
🔄 Proxies configured for:
   - /api/rdtclient → http://192.168.1.100:6500
   - /api/trakt → https://api.trakt.tv
   ...
```

## Troubleshooting

### Cannot connect to RDT Client

Make sure:
1. The RDT Client URL is accessible from within the Docker container
2. If RDT Client is on the host machine, use the host's IP address, not `localhost`
3. Check firewall rules allow the connection

### Getting "Proxy error" messages

Check the Docker logs for detailed error messages:
```bash
docker logs ted
```

The server logs all proxy errors with details about which API failed.
