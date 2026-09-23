import mongoose from 'mongoose';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedInitialLeadsIfEmpty } from '../utils/seedData';

// Ensure reliable SRV DNS resolution on Windows / custom networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setting servers is restricted
}

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri) {
    try {
      console.log(`Connecting to configured MongoDB URI (${uri.split('@')[1] || uri})...`);
      const conn = await mongoose.connect(uri);
      console.log(' MongoDB connected successfully.');
      await seedInitialLeadsIfEmpty();
      return conn;
    } catch (err) {
      console.warn('⚠️ Could not connect to configured MONGODB_URI. Falling back to in-memory MongoDB...', err);
    }
  }

  // Fallback to in-memory MongoDB
  console.log('⚡ Starting in-memory MongoDB instance (zero external dependency mode)...');
  mongoMemoryServer = await MongoMemoryServer.create();
  const memUri = mongoMemoryServer.getUri();
  const conn = await mongoose.connect(memUri);
  console.log(' Connected to in-memory MongoDB at:', memUri);
  await seedInitialLeadsIfEmpty();
  return conn;
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
}
