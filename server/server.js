const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { authenticateUser } = require("./dao/usersDao");

const app = express();
const PORT = 3000;

// Setup server
app.use(cors());
app.use(bodyParser.json());

// http://localhost:3000/login
app.post("/login", (req, res) => {
  console.log("-- Received POST /login request");
  console.log("Request body:", req.body);

  const { username, password } = req.body;

  // Error when username or password missing.
  // This should be handled by the form validation in our page.
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Look up user in DAO
  const user = authenticateUser(username, password);

  if (user) {
    // User found successfully
    const sessionId = uuidv4();
    return res.status(200).json({ sessionId });
  } else {
    // User not found successfully
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
