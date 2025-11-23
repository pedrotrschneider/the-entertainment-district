# The Entertainment District (TED)

The Entertainment District is a modern, sleek web application designed to manage your media consumption. Inspired by Debrid Media Manager and Stremio, TED allows you to browse a vast catalog of movies and shows, find torrents, and either stream them directly via Real-Debrid or download them to your home server using RDT Client.

![Home page Screenshot](/media/home-page.png)

## Features

*   **Media Catalog**: Browse movies and TV shows with rich metadata (powered by Cinemeta).
*   **Torrent Integration**: Find high-quality streams from Torrent.io sources.
*   **Real-Debrid**: Add torrents to your cloud and stream directly in the browser.
*   **RDT Client**: Send downloads to your local home server with a single click.
*   **Trakt Sync**: Keep your watchlist and watched history in sync.

## Quick Start (Docker)

The easiest way to run TED is using Docker.

1.  Copy the sample docker-compose file:
    ```bash
    cp docker-compose.sample.yml docker-compose.yml
    ```

2.  Edit `docker-compose.yml` and set your environment variables (see [Configuration](#configuration)).

3.  Start the container:
    ```bash
    docker-compose up -d
    ```

Access the app at `http://localhost:8080`.

## Development Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Configuration

You can configure TED via the Settings page in the UI, or pre-configure it using environment variables.

### Environment Variables

Create a `.env` file (or use `docker-compose.yml`) with the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_RDT_CLIENT_URL` | URL to your RDT Client instance | `http://localhost:6500` |
| `VITE_REAL_DEBRID_API_KEY` | Real-Debrid API Key | - |
| `VITE_TMDB_API_KEY` | TMDB API Key | - |
| `VITE_TRAKT_CLIENT_ID` | Trakt Client ID | - |
| `VITE_RDT_CLIENT_USERNAME` | RDT Client Username | - |
| `VITE_RDT_CLIENT_PASSWORD` | RDT Client Password | - |

See [Environment Configuration Guide](docs/SETTINGS_ENV_VARS.md) for full details.

## Documentation

*   [**Docker Deployment Guide**](docs/DOCKER_DEPLOYMENT.md): Detailed instructions for deploying with Docker.
*   [**Environment Variables**](docs/SETTINGS_ENV_VARS.md): Complete list of configuration options.
*   [**TMDB Setup**](docs/TMDB_SETUP.md): How to get your TMDB API key.
*   [**Trakt Setup**](docs/TRAKT_SETUP.md): How to configure Trakt integration.
*   [**Project Structure**](docs/PROJECT_STRUCTURE.md): Overview of the codebase organization.

## Tech Stack

*   **Frontend**: React + Vite
*   **Styling**: Vanilla CSS (Variables & Modern Layouts)
*   **State Management**: Zustand
*   **Icons**: Lucide React
*   **Routing**: React Router DOM
*   **Deployment**: Docker + Node.js Express Server

