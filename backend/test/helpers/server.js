const http = require('http');
const app = require('../../src/app');

// Use a fresh anonymous port per server and share a base URL + fetch helper.

const startServer = () =>
  new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
    server.on('error', reject);
  });

const stopServer = (server) =>
  new Promise((resolve) => {
    server.close(resolve);
  });

const api = (baseUrl) => async (path, { method = 'GET', body, token, headers = {} } = {}) => {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}${path}`, opts);
  const data = await res.json().catch(() => null);
  return { status: res.status, body: data };
};

module.exports = { startServer, stopServer, api };