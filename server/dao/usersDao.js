// Define some sample users in the local storage
const users = [
  { username: "admin", password: "admin" },
  { username: "katerina", password: "katerina" },
  { username: "alex", password: "alex" },
];

// Function to authenticate user
async function authenticateUser(db, username, password) {
  if (!db) {
    // Use local storage
    return users.find(
      (user) => user.username === username && user.password === password
    );
  }

  // Look up user in MongoDB
  const user = await db.collection("users").findOne({ username, password });

  return user ? { username: user.username } : null;
}

module.exports = { authenticateUser };
