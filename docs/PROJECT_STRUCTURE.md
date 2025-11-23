# Project Structure

The Entertainment District (TED) application has been organized into a clean, maintainable structure.

## Directory Structure

```
ted/
├── docs/                      # Documentation files
│   ├── DOCKER.md              # Docker general documentation
│   ├── DOCKER_DEPLOYMENT.md   # Docker deployment guide
│   ├── DOCKER_ENV_GUIDE.md    # Environment variables guide
│   ├── TMDB_SETUP.md          # TMDB API setup instructions
│   └── TRAKT_SETUP.md         # Trakt API setup instructions
├── docker/                    # Docker-related files
│   ├── .dockerignore          # Docker build exclusions
│   ├── Dockerfile             # Docker image configuration
│   ├── docker-compose.yml     # Docker Compose configuration
│   └── server.js              # Express production server
├── src/                       # Application source code
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── services/              # API service modules
│   └── store/                 # State management
├── public/                    # Static assets
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment variables template
├── package.json               # Node.js dependencies
├── vite.config.js             # Vite configuration
└── README.md                  # Main documentation
```

## Key Files

### Configuration
- **`.env`** - Environment variables (RDT Client URL, etc.)
- **`.env.example`** - Template for environment setup
- **`vite.config.js`** - Development server and proxy configuration
- **`package.json`** - Dependencies and scripts

### Docker
- **`docker/Dockerfile`** - Multi-stage build for production
- **`docker/docker-compose.yml`** - Orchestration with env file support
- **`docker/server.js`** - Express server with API proxies
- **`docker/.dockerignore`** - Files excluded from Docker builds

### Documentation
All setup guides and deployment instructions are in the `docs/` folder.

## Running the Application

### Development
```bash
npm install
npm run dev
```

### Production (Docker)
```bash
cd docker
docker-compose up -d
```

See [`docs/DOCKER_DEPLOYMENT.md`](docs/DOCKER_DEPLOYMENT.md) for detailed deployment instructions.

## Path References

When working with Docker files, note that:
- The build context is the root directory (`..` from docker folder)
- The `.env` file is in the root directory
- The `server.js` is copied from `docker/server.js`

This structure keeps the root directory clean while organizing related files together.
