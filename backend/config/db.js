import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[DB] Connected to MongoDB Atlas / Standalone: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`[DB] Could not connect to MONGODB_URI (${err.message}). Falling back to Embedded In-Memory MongoDB...`);
      }
    }

    // In-memory fallback
    console.log('[DB] Starting Embedded In-Memory MongoDB Server for frictionless setup...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    
    const conn = await mongoose.connect(memoryUri);
    console.log(`[DB] Connected to Embedded MongoDB Server: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`[DB] Critical Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
