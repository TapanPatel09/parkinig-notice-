/**
 * Spiritual Program Parking Notice Generator - OBS Local Server
 * 
 * Zero-dependency Node.js HTTP server.
 * Handles:
 * 1. Static file serving (index.html, obs.html, assets, css, js)
 * 2. Instant real-time updates to OBS Browser Source via Server-Sent Events (SSE)
 * 3. Saving latest notice as physical 1920x1080 PNG file on disk (latest-notice.png)
 * 4. In-memory caching for immediate display when OBS starts or switches scenes
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const LATEST_IMAGE_PATH = path.join(ROOT_DIR, 'latest-notice.png');
const LATEST_JSON_PATH = path.join(ROOT_DIR, 'latest-notice.json');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// In-memory state
let latestNotice = null;

// Try loading persisted notice from disk on startup if exists
try {
  if (fs.existsSync(LATEST_JSON_PATH)) {
    const raw = fs.readFileSync(LATEST_JSON_PATH, 'utf8');
    latestNotice = JSON.parse(raw);
    console.log('[OBS Server] Restored previous notice state from latest-notice.json');
  }
} catch (err) {
  console.warn('[OBS Server] Could not read existing latest-notice.json:', err.message);
}

// Active Server-Sent Events (SSE) connections for OBS Browser Sources
const sseClients = new Set();

/**
 * Broadcast an event to all connected OBS Browser Source clients
 */
function broadcastSseEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch (err) {
      console.warn('[OBS Server] Failed sending to a client, removing client:', err.message);
      sseClients.delete(client);
    }
  }
}

/**
 * Send standard CORS headers to allow requests from any local origin / file:///
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
}

/**
 * Handle incoming HTTP requests
 */
const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // API ROUTE: Send notice from web app -> OBS
  // =========================================================================
  if (req.method === 'POST' && pathname === '/api/send-notice') {
    let body = '';

    // Collect request body (limit to 25MB to accommodate high-res 1080p base64)
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload too large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (!data.imageData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing imageData' }));
          return;
        }

        const timestamp = Date.now();
        latestNotice = {
          imageData: data.imageData,
          vehicleNumber: data.vehicleNumber || '',
          noticeType: data.noticeType || '',
          programName: data.programName || '',
          timestamp: timestamp,
          visible: true
        };

        // Extract base64 image and save as physical file on disk (latest-notice.png)
        const base64PrefixMatch = data.imageData.match(/^data:image\/png;base64,(.+)$/);
        if (base64PrefixMatch) {
          const imageBuffer = Buffer.from(base64PrefixMatch[1], 'base64');
          fs.writeFile(LATEST_IMAGE_PATH, imageBuffer, err => {
            if (err) console.error('[OBS Server] Error saving latest-notice.png:', err);
          });
        }

        // Persist JSON metadata (non-blocking)
        fs.writeFile(LATEST_JSON_PATH, JSON.stringify(latestNotice), err => {
          if (err) console.error('[OBS Server] Error saving latest-notice.json:', err);
        });

        // Broadcast immediately to OBS Browser Sources via SSE
        broadcastSseEvent('update', {
          timestamp: timestamp,
          vehicleNumber: latestNotice.vehicleNumber,
          imageData: latestNotice.imageData,
          visible: true
        });

        console.log(`[OBS Server] Notice broadcasted: [${latestNotice.vehicleNumber}] to ${sseClients.size} OBS client(s).`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          timestamp: timestamp,
          obsClients: sseClients.size,
          message: 'Notice pushed to OBS successfully'
        }));

      } catch (err) {
        console.error('[OBS Server] Error processing send-notice:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process notice: ' + err.message }));
      }
    });
    return;
  }

  // =========================================================================
  // API ROUTE: Clear notice from OBS screen
  // =========================================================================
  if (req.method === 'POST' && pathname === '/api/clear-notice') {
    if (latestNotice) {
      latestNotice.visible = false;
    }
    broadcastSseEvent('clear', { timestamp: Date.now(), visible: false });
    console.log('[OBS Server] Notice cleared from OBS screen.');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Notice cleared' }));
    return;
  }

  // =========================================================================
  // API ROUTE: Get latest notice JSON
  // =========================================================================
  if (req.method === 'GET' && pathname === '/api/latest-notice') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(latestNotice || { visible: false }));
    return;
  }

  // =========================================================================
  // API ROUTE: Get raw latest-notice.png image
  // =========================================================================
  if (req.method === 'GET' && (pathname === '/api/latest-notice.png' || pathname === '/latest-notice.png')) {
    if (fs.existsSync(LATEST_IMAGE_PATH)) {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      const stream = fs.createReadStream(LATEST_IMAGE_PATH);
      stream.pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('No notice rendered yet.');
    }
    return;
  }

  // =========================================================================
  // API ROUTE: Server-Sent Events (SSE) Stream for OBS Browser Source
  // =========================================================================
  if (req.method === 'GET' && pathname === '/api/obs-events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    // Register OBS client
    sseClients.add(res);
    console.log(`[OBS Server] OBS Browser Source connected. Total active OBS clients: ${sseClients.size}`);

    // Send initial handshake
    res.write(`event: connected\ndata: ${JSON.stringify({ timestamp: Date.now(), clients: sseClients.size })}\n\n`);

    // If a notice is already active, push it immediately to this newly connected OBS client
    if (latestNotice && latestNotice.visible) {
      res.write(`event: update\ndata: ${JSON.stringify({
        timestamp: latestNotice.timestamp,
        vehicleNumber: latestNotice.vehicleNumber,
        imageData: latestNotice.imageData,
        visible: true
      })}\n\n`);
    }

    // Ping every 15s to keep connection alive through OS sleep / network idle
    const pingInterval = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (e) {
        clearInterval(pingInterval);
      }
    }, 15000);

    // Clean up on disconnect
    req.on('close', () => {
      clearInterval(pingInterval);
      sseClients.delete(res);
      console.log(`[OBS Server] OBS Browser Source disconnected. Remaining clients: ${sseClients.size}`);
    });
    return;
  }

  // =========================================================================
  // API ROUTE: Server health & status
  // =========================================================================
  if (req.method === 'GET' && pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      obsClients: sseClients.size,
      hasActiveNotice: !!(latestNotice && latestNotice.visible),
      latestVehicle: latestNotice ? latestNotice.vehicleNumber : null,
      lastUpdated: latestNotice ? latestNotice.timestamp : null
    }));
    return;
  }

  // =========================================================================
  // STATIC FILE SERVING
  // =========================================================================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      // Do not cache HTML/JS/CSS in local development/broadcast environment
      'Cache-Control': (ext === '.html' || ext === '.js' || ext === '.css') 
        ? 'no-cache, must-revalidate' 
        : 'public, max-age=3600'
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('  Spiritual Program Parking Notice - OBS Local Server Running   ');
  console.log('================================================================');
  console.log(`  * Web Application URL:   http://localhost:${PORT}`);
  console.log(`  * OBS Browser Source URL: http://localhost:${PORT}/obs.html`);
  console.log(`  * Local Image File:      ${LATEST_IMAGE_PATH}`);
  console.log('----------------------------------------------------------------');
  console.log('  Ready! Open http://localhost:3000 in your browser, and set');
  console.log('  OBS Browser Source URL to: http://localhost:3000/obs.html');
  console.log('================================================================\n');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use by another program!`);
    console.error(`Close the program using port ${PORT} or run with a different port:`);
    console.error(`  set PORT=3001 && node server.js\n`);
  } else {
    console.error('[ERROR] Server error:', err);
  }
});
