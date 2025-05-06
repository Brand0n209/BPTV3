const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('🚀 Bright Prodigy is Live!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
