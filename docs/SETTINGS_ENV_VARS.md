# Environment Variable Configuration for Settings

You can now configure default application settings via environment variables. This is useful for:
- Pre-configuring settings for deployments
- Setting up defaults for teams/organizations
- Dockerized deployments with consistent configuration

## How It Works

**Priority Order:**
1. **Browser Storage** (highest priority) - Settings saved in the browser
2. **Environment Variables** - Defaults from `.env` file
3. **Empty/Default** - If neither exists

This means users can always override environment defaults in the Settings page, and their preferences will be saved in the browser.

## Available Environment Variables

Add these to your `.env` or `.env.local` file:

```bash
# Real-Debrid API Key
VITE_REAL_DEBRID_API_KEY=your_api_key_here

# RDT Client Credentials
VITE_RDT_CLIENT_USERNAME=admin
VITE_RDT_CLIENT_PASSWORD=your_password

# RDT Client Download Paths
VITE_RDT_CLIENT_MOVIES_PATH=Movies
VITE_RDT_CLIENT_SHOWS_PATH=TV Shows

# TMDB API Key
VITE_TMDB_API_KEY=your_tmdb_api_key

# Trakt Client ID
VITE_TRAKT_CLIENT_ID=your_trakt_client_id
```

## Usage Examples

### For Personal Use

Create `.env.local` (not tracked by git):
```bash
# .env.local
VITE_REAL_DEBRID_API_KEY=abc123xyz
VITE_TMDB_API_KEY=def456uvw
VITE_TRAKT_CLIENT_ID=ghi789rst
```

### For Docker Deployment

Use environment variables in docker-compose:
```yaml
environment:
  - VITE_REAL_DEBRID_API_KEY=${REAL_DEBRID_API_KEY}
  - VITE_TMDB_API_KEY=${TMDB_API_KEY}
  - VITE_TRAKT_CLIENT_ID=${TRAKT_CLIENT_ID}
```

Or use `env_file`:
```yaml
env_file:
  - .env
```

### For Team Deployment

Commit a `.env` file with team defaults:
```bash
# .env (tracked in git)
# Team defaults - users can override in browser
VITE_RDT_CLIENT_MOVIES_PATH=Movies
VITE_RDT_CLIENT_SHOWS_PATH=TV Shows
VITE_TRAKT_CLIENT_ID=team_trakt_client_id
```

Individual developers can create `.env.local` with their personal keys:
```bash
# .env.local (not tracked)
VITE_REAL_DEBRID_API_KEY=my_personal_key
VITE_TMDB_API_KEY=my_tmdb_key
```

## Important Notes

1. **`VITE_` Prefix Required**: Environment variables must start with `VITE_` to be accessible in the browser
2. **Build Time**: Vite embeds these values at build time, so you need to rebuild if you change them
3. **Security**: Never commit sensitive keys to git. Use `.env.local` for secrets
4. **Browser Overrides**: Once a user changes a setting in the browser, that takes precedence over env vars

## Clearing Browser Settings

If you want to reset to environment variable defaults:
1. Open browser DevTools
2. Go to Application → Local Storage
3. Delete the `ted-settings` key
4. Refresh the page

The app will now use environment variable defaults again.

## Example Workflow

1. **Initial Setup**: Set env variables in `.env.local`
2. **First Run**: App loads with env defaults
3. **User Customization**: User changes settings in Settings page
4. **Persistent**: Browser saves user preferences
5. **Reset**: User can clear browser storage to go back to env defaults

This gives you the best of both worlds: sensible defaults via config files, with full user control! 🎉
