const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connection established with MongoDB.");
    return client.db(dbName);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
