app.use((err: any, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  log(`Error: ${message}, Stack: ${err.stack}`);
  // Don't throw here
});
