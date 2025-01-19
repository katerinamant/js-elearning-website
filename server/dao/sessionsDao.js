// Local storage of sessions
const sessions = {}; // { sessionId: username }

// Function to add a session for a user
async function addSession(db, username, sessionId) {
  if (!db) {
    // Use local storage
    sessions[sessionId] = username;
    return;
  }

  // Update MongoDB
  await db.collection("sessions").updateOne(
    { username },
    { $set: { sessionId, createdAt: new Date() } },
    { upsert: true }
  );
}

// Function to verify a session
async function verifySession(db, username, sessionId) {
  if (!db) {
    // Use local storage
    return sessions[sessionId] === username;
  }

  // Look up in MongoDB
  const session = await db.collection("sessions").findOne({ username, sessionId });
  return !!session;
}

// Function to delete a session
async function deleteSession(db, sessionId) {
  if (!db) {
    // Use local storage
    delete sessions[sessionId];
    return;
  }

  // Update MongoDB
  await db.collection("sessions").deleteOne({ sessionId });
}

module.exports = { addSession, verifySession, deleteSession };
