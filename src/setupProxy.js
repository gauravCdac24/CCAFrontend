const { createProxyMiddleware } = require("http-proxy-middleware");

// IMPORTANT: use 127.0.0.1 — Windows blocks same-host connections to the LAN IP (hairpin).
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      // Local CRA dev server only. Test-profile gateway listens on 8080.
      // Production builds do not load this file.
      target: "http://127.0.0.1:8080",
      changeOrigin: true,
      secure: false,
      logLevel: "warn",
    })
  );
};
