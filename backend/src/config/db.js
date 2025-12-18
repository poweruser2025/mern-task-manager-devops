const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    if (!uri) {
      throw new Error("MONGO_URI is missing. Check backend/.env");
    }
    console.log("Attempting MongoDB connect...");
    // show only first 40 chars of URI to avoid leaking secret in logs
    console.log("MONGO_URI (preview):", uri.slice(0, 40) + "...");

    await mongoose.connect(uri, {
      // keep options for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("--- FULL MongoDB connection ERROR ---");
    // print full error object so we can see parsing/auth/network issues
    console.error(err && (err.message || err));
    console.error(err);
    // rethrow so process exits and you can read the stack when running node
    throw err;
  }
}

module.exports = connectDB;
