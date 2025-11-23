# TMDB API Setup

The Entertainment District uses The Movie Database (TMDB) API to fetch cast information with photos and character names.

## Get Your Free API Key

1. **Create a TMDB Account**
   - Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
   - Sign up for a free account

2. **Request an API Key**
   - Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Request an API Key"
   - Choose "Developer" (for personal/educational use)
   - Fill out the form:
     - Application Name: "The Entertainment District"
     - Application URL: "http://localhost:5173" (or your dev URL)
     - Application Summary: "Personal media browser"
   - Accept the terms and submit

3. **Copy Your API Key**
   - You'll receive an "API Key (v3 auth)" - this is what you need
   - It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## Configure the App

1. Open `src/services/tmdb.js`
2. Find this line:
   ```javascript
   const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const TMDB_API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```
4. Save the file

## Verify It Works

1. Open any movie or show details page
2. You should see the cast carousel with:
   - Real actor photos from TMDB
   - Character names below each actor
   - No more 401 errors in the console

## Note

- The API key is free and allows 50 requests per second
- For production use, consider using environment variables to store the key
- Never commit your API key to public repositories
