// Define some sample users
const users = [
  { username: "admin", password: "admin" },
  { username: "katerina", password: "katerina" },
  { username: "alex", password: "alex" },
];

// Function to authenticate a user
function authenticateUser(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

module.exports = { authenticateUser };
