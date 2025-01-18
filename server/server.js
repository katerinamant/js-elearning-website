const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Import DAOs
const { authenticateUser } = require("./dao/usersDao.js");
const {
  addSession,
  verifySession,
  deleteSession,
} = require("./dao/sessionsDao.js");
const {
  userHasItem,
  addItemToUser,
  removeItemFromUser,
  getUserCart,
} = require("./dao/cartsDao.js");

const app = express();
const PORT = 3000;

// Setup server
app.use(cors());
app.use(bodyParser.json());

// http://localhost:3000/login
// Login Service (LS)
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

    // Generate a session ID
    const sessionId = uuidv4();

    // Store the session
    addSession(username, sessionId);

    // Return the session ID
    return res.status(200).json({ sessionId });
  } else {
    // User not found successfully
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// http://localhost:3000/cart

// GET
// Cart Retrieval Service (CRS)
app.get("/cart", (req, res) => {
  console.log("-- Received GET /cart request");
  console.log(`Request query: ${JSON.stringify(req.query)}`);

  const { username, sessionId } = req.query;

  // Error when anything missing.
  if (!username || !sessionId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Verify the session
  if (!verifySession(username, sessionId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please log in again." });
  }

  return res.status(200).json({
    status: "success",
    message: `Cart returned for ${username} (${sessionId})`,
    content: getUserCart(username),
  });
});

// POST
// Cart Item Service (CIS)
app.post("/cart", (req, res) => {
  console.log("-- Received POST /cart request");
  console.log("Request body:", req.body);

  const { id, title, cost, type, username, sessionId } = req.body;

  // Error when anything missing.
  if (!id || !title || !cost || !type || !username || !sessionId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Verify the session
  if (!verifySession(username, sessionId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please log in again." });
  }

  // Check if the user already has this item in their cart
  if (userHasItem(username, id)) {
    console.log(`User ${username} already has item ${id} in their cart.`);
    return res.status(409).json({
      status: "error",
      message: "Item is already in your cart.",
    });
  }

  // Add the item to the cart
  addItemToUser(username, { id, title, cost, type });
  console.log(`Added item ${id} to ${username}'s cart.`);
  return res.status(200).json({
    status: "success",
    message: "Item added to cart successfully.",
  });
});

// http://localhost:3000/cart/remove
// Cart Update Service (CUS)
app.post("/cart/remove", (req, res) => {
  console.log("-- Received POST /cart/remove request");
  console.log("Request body:", req.body);

  const { id, username, sessionId } = req.body;

  // Error when anything missing.
  if (!id || !username || !sessionId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Verify the session
  if (!verifySession(username, sessionId)) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please log in again." });
  }

  // Check if the user does not have item in cart
  if (!userHasItem(username, id)) {
    console.log(`User ${username} does not have item ${id} in their cart.`);
    return res.status(409).json({
      status: "error",
      message: "Item not in cart.",
    });
  }

  // Remove item from cart
  removeItemFromUser(username, id);
  console.log(`Removed item ${id} from ${username}'s cart.`);
  return res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully, updated cart.",
    content: getUserCart(username),
  });
});

// http://localhost:3000/logout
app.post("/logout", (req, res) => {
  console.log("-- Received POST /logout request");
  console.log("Request body:", req.body);

  const { sessionId } = req.body;

  if (sessionId) {
    // Remove a valid sessionId
    deleteSession(sessionId);
    return res.status(200).json({ message: "Logged out successfully." });
  } else {
    return res.status(400).json({ message: "Session ID is required." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
