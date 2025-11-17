const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// look for common static output directories
const staticDirs = ['dist', 'public', 'build'];
const staticDir = staticDirs.find(dir => fs.existsSync(path.join(__dirname, dir)));

if (staticDir) {
  const root = path.join(__dirname, staticDir);
  app.use(express.static(root));
  // SPA fallback to index.html if present
  app.get('*', (req, res) => {
    const indexPath = path.join(root, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return res.status(404).send('Not Found');
  });
} else {
  // helpful default endpoint when no static build is present
  app.get('/', (req, res) => {
    res.type('text').send(
      'No static build found. Place your static files in /dist, /public, or /build, or implement your own server.'
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
