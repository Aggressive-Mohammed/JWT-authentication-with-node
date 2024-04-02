// Importing required modules
const express = require('express'); // Importing Express framework
const auth = require('./routes/auth'); // Importing authentication routes

const posts = require('./routes/posts'); // Importing authentication routes

const app = express(); // Creating Express application instance

app.use(express.json()); // Middleware to parse JSON requests

app.use("/auth", auth); // Mounting authentication routes under the "/auth" endpoint

app.use("/posts", posts); // Mounting authentication routes under the "/auth" endpoint

const port = 3000; // Port number for server to listen on

// Start the server and listen on specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`); // Log message indicating server is listening
});
