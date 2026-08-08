/**
 * Zero-dependency static server for the exported site in `out/`.
 *
 * Exists because opening out/index.html straight from the filesystem is not
 * reliable: Chrome treats every file:// document as an opaque origin, which
 * can block webfont loads and any runtime fetch. Serving over http on
 * localhost sidesteps all of that and behaves exactly like the real site.
 *
 * Started by "Open Website.bat" — no terminal or npm needed.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const ROOT = path.join(__dirname, "..", "out");
const START_PORT = 4273;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
};

if (!fs.existsSync(ROOT)) {
  console.error("\n  Could not find the exported site at:\n  " + ROOT);
  console.error("\n  Run  npm run export  first, then try again.\n");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(ROOT, urlPath);

  // Directory -> index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  // Never serve outside out/
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, "404.html");
    if (!fs.existsSync(filePath)) {
      res.writeHead(404).end("Not found");
      return;
    }
  }

  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(filePath).pipe(res);
});

function listen(port, attemptsLeft) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error("Could not start the server:", err.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log("\n  In.Reality - brand site");
    console.log("  Running at " + url);
    console.log("\n  Leave this window open while you view the site.");
    console.log("  Close it (or press Ctrl+C) when you are done.\n");
    exec(`start "" "${url}"`);
  });
}

listen(START_PORT, 15);
