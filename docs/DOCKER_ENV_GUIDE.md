# Docker Environment Configuration Quick Reference

## Using .env file with Docker

Your `.env` file contains configuration like:
```bash
VITE_RDT_CLIENT_URL=http://192.168.1.100:6500
```

## Deployment Options

### Option 1: docker-compose (Recommended) ⭐

Docker Compose automatically reads your `.env` file:

```bash
docker-compose up -d
```

That's it! No extra flags needed. The `env_file` directive in `docker-compose.yml` loads variables from `.env`.

### Option 2: Docker run with --env-file

```bash
# Build
docker build -t ted-app .

# Run with .env file
docker run -d -p 80:80 --env-file .env --name ted ted-app
```

### Option 3: Docker run with individual -e flags

```bash
docker run -d -p 80:80 \
  -e VITE_RDT_CLIENT_URL=http://192.168.1.100:6500 \
  --name ted \
  ted-app
```

## Updating Configuration

### With docker-compose:
1. Edit `.env` file
2. Restart: `docker-compose restart`

### With docker run:
1. Edit `.env` file
2. Stop: `docker stop ted && docker rm ted`
3. Start: `docker run -d -p 80:80 --env-file .env --name ted ted-app`

## Verifying Configuration

Check what environment variables are loaded:
```bash
docker exec ted env | grep VITE_RDT_CLIENT_URL
```

Or check the server logs:
```bash
docker logs ted
```

You should see:
```
📡 RDT Client URL: http://192.168.1.100:6500
```

## Important Notes

- The `.env` file is read at **runtime**, not build time
- You don't need to rebuild the image when changing `.env`
- Just restart the container to pick up new values
- The Dockerfile only sets `PORT=80` as a default
- All other values come from your `.env` file
