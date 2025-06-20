import app from "./app";

const port = process.env.PORT || 3000;

const server = Bun.serve({
  port,
  hostname: "0.0.0.0",
  fetch: app.fetch,
});

console.log(`Server running on port ${server.port}`);
