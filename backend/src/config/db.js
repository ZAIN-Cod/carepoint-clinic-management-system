import mongoose from 'mongoose'
import { env } from './env.js'

let memMongo = null

export async function connectDB() {
  const uri = env.mongodbUri

  try {
    if (uri && uri.trim() !== '') {
      console.log('Connecting to MongoDB via MONGODB_URI...')
      const conn = await mongoose.connect(uri)
      console.log(`MongoDB connected: ${conn.connection.host}`)
      return conn
    }

    console.warn('MONGODB_URI is empty. Attempting local development fallback (Memory Server)...')
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      memMongo = await MongoMemoryServer.create()
      const memUri = memMongo.getUri()
      console.log(`In-memory MongoDB started at: ${memUri}`)
      const conn = await mongoose.connect(memUri)
      console.log(`Connected to in-memory MongoDB (${conn.connection.host})`)
      return conn
    } catch (memErr) {
      console.error('Failed to launch in-memory MongoDB fallback:', memErr.message)
      throw new Error(
        'Database connection failed. Please set MONGODB_URI in backend/.env with your MongoDB Atlas connection string.'
      )
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`)
    throw error
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    if (memMongo) {
      await memMongo.stop()
      memMongo = null
    }
    console.log('MongoDB disconnected gracefully.')
  } catch (error) {
    console.error(`Error disconnecting MongoDB: ${error.message}`)
  }
}
