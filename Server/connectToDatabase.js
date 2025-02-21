const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");

async function connectToDatabase() {
  try {
    // Define paths for binary files and data storage
    const binaryPath = path.join("mongo", "./mongodb-binaries");
    const dbPath = path.join("mongo", "./mongodb-data");

    process.env.MONGOMS_SYSTEM_BINARY = path.join(binaryPath, "mongod.exe");

    const mongod = new MongoMemoryServer({
      instance: {
        dbName: "PortableDatabase",
        dbPath: "./mongo", // Path to store data persistently
        storageEngine: "wiredTiger",
        port: 27017,
      },
      binary: {
        version: "4.0.28", // Specify MongoDB version
        downloadDir: "./mongo", // Path to download binaries
        mongodBinaryPath: path.join(binaryPath, "mongod.exe"),
        skipMD5: true,
        autoDownload: false, // Avoid re-downloading binaries
      },
      autoStart: false,
    });

    // Start the MongoDB instance and get URI
    await mongod.start();
    const mongoUri = await mongod.getUri();

    console.log("MongoDB Portable URI:", mongoUri);

    // Connect Mongoose to the MongoDB instance
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: "PortableDatabase",
    });

    console.log("MongoDB connected with portable, persistent storage.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = connectToDatabase;
