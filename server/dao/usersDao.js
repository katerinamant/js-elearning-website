const { connectDB } = require("../db");

// Function to authenticate user
async function authenticateUser(db, username, password) {
  const user = await db.collection("users").findOne({ username, password });

  return user ? { username: user.username } : null;
}

module.exports = { authenticateUser };
