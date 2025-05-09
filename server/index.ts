import app from "./app";

const port = process.env.PORT || 5001;

Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`Server running on http://localhost:${port}`);
