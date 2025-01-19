// Function to a session for a user
async function addSession(db, username, sessionId) {
  await db.collection("sessions").updateOne(
    { username },
    { $set: { sessionId, createdAt: new Date() } },
    { upsert: true }
  );
}

// Function to verify a session
async function verifySession(db, username, sessionId) {
  const session = await db.collection("sessions").findOne({ username, sessionId });
  return !!session;
}

// Function to delete a session
async function deleteSession(db, sessionId) {
  await db.collection("sessions").deleteOne({ sessionId });
}

module.exports = { addSession, verifySession, deleteSession };
