import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Read RDT Client URL from environment variable
const RDT_CLIENT_URL = process.env.VITE_RDT_CLIENT_URL || 'http://localhost:6500';

console.log('🚀 Starting server...');
console.log(`📡 RDT Client URL: ${RDT_CLIENT_URL}`);

// API Proxies - matching vite.config.js setup
const proxyOptions = {
    changeOrigin: true,
    logLevel: 'warn',
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error' });
    },
};

// RDT Client API - uses environment variable
app.use('/api/rdtclient', createProxyMiddleware({
    ...proxyOptions,
    target: RDT_CLIENT_URL,
    pathRewrite: { '^/api/rdtclient': '' },
}));

// Trakt API
app.use('/api/trakt', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://api.trakt.tv',
    pathRewrite: { '^/api/trakt': '' },
    secure: false,
}));

// TMDB API
app.use('/api/tmdb', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://api.themoviedb.org/3',
    pathRewrite: { '^/api/tmdb': '' },
    secure: false,
}));

// TMDB Images
app.use('/api/tmdb-images', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://image.tmdb.org/t/p',
    pathRewrite: { '^/api/tmdb-images': '' },
    secure: false,
}));

// Torrentio
app.use('/api/torrentio', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://torrentio.strem.fun',
    pathRewrite: { '^/api/torrentio': '' },
    secure: false,
}));

// Cinemeta
app.use('/api/cinemeta', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://v3-cinemeta.strem.io',
    pathRewrite: { '^/api/cinemeta': '' },
    secure: false,
}));

// Real-Debrid API
app.use('/api/realdebrid', createProxyMiddleware({
    ...proxyOptions,
    target: 'https://api.real-debrid.com/rest/1.0',
    pathRewrite: { '^/api/realdebrid': '' },
    secure: false,
}));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, filePath) => {
        // Don't cache index.html
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        }
    },
}));

// SPA routing - all NON-API routes go to index.html
// This must come AFTER API proxies and static files
app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
    console.log('🔄 Proxies configured for:');
    console.log(`   - /api/rdtclient → ${RDT_CLIENT_URL}`);
    console.log('   - /api/trakt → https://api.trakt.tv');
    console.log('   - /api/tmdb → https://api.themoviedb.org/3');
    console.log('   - /api/tmdb-images → https://image.tmdb.org/t/p');
    console.log('   - /api/torrentio → https://torrentio.strem.fun');
    console.log('   - /api/cinemeta → https://v3-cinemeta.strem.io');
    console.log('   - /api/realdebrid → https://api.real-debrid.com/rest/1.0');
});
