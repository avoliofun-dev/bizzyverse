/**
 * BIZVERSE - Server Inti Berbasis JavaScript Framework (Node.js)
 * Melayani antarmuka web dunia bisnis virtual 3D, bursa saham, dan endpoint REST API.
 * Kompatibel dengan Vercel Serverless Function & Local Node.js Runtime.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || 'localhost';
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = parsedUrl.pathname;

  // Endpoint REST API
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify({
      aplikasi: 'BIZVERSE',
      status: 'ONLINE',
      versi: '2.5.0',
      framework: 'JavaScript (Node.js Engine)',
      waktuServer: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/leaderboard') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify([
      { peringkat: 1, nama: 'CyberDyne Global', ceo: 'Viktor Kane', valuasi: 85400000, kategori: 'Sindikat Bisnis Antariksa' },
      { peringkat: 2, nama: 'Titan Orbital Corp', ceo: 'Sarah Chen', valuasi: 42100000, kategori: 'Megacorp Multinasional' },
      { peringkat: 3, nama: 'Aether Nexus Ltd', ceo: 'CryptoWhale_99', valuasi: 18400000, kategori: 'Konglomerat Blue-Chip' },
      { peringkat: 4, nama: 'OmniNet Solutions', ceo: 'CyberTycoon_ID', valuasi: 9200000, kategori: 'Konglomerat Blue-Chip' },
      { peringkat: 5, nama: 'Quantum Leap Labs', ceo: 'Luna_Quantum', valuasi: 5400000, kategori: 'Korporasi Menengah' }
    ]));
    return;
  }

  // Melayani Berkas Statis Web
  let cleanPath = pathname.split('?')[0];
  let safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\' || safePath === '') {
    safePath = 'index.html';
  }
  safePath = safePath.replace(/^[/\\]+/, '');

  // Cari di direktori root atau public
  let filePath = path.join(__dirname, safePath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', safePath);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Fallback ke index.html untuk Single Page Navigation jika ada
      const fallbackPath = path.join(__dirname, 'index.html');
      fs.readFile(fallbackPath, (fbErr, fbContent) => {
        if (!fbErr && !ext) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(fbContent);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('404 Halaman Tidak Ditemukan');
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

const server = http.createServer(handler);

// Ekspor handler untuk Vercel Serverless Function
module.exports = handler;

// Jalankan HTTP listener jika dijalankan secara langsung di komputer lokal
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🌐 Server BIZVERSE JavaScript Aktif di http://localhost:${PORT}`);
    console.log('================================================================');
  });
}
