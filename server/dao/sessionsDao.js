const sessions = {}; // { sessionId: username }

// Function to a session for a user
function addSession(username, sessionId) {
  sessions[sessionId] = username;
}

// Function to verify a session
function verifySession(username, sessionId) {
  return sessions[sessionId] === username;
}

// Function to delete a session
function deleteSession(sessionId) {
  delete sessions[sessionId];
}

module.exports = { addSession, verifySession, deleteSession };
