const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4000; // Use 4000 if that's what your frontend expects

const server = http.createServer(app);

// Import and initialize socket
const { initializeSocket } = require("./socket");
initializeSocket(server);

// --- START SERVER ---
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
