
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import app from './app.js'

import { connectDB, disconnectDB } from './config/db.js'
import { env } from './config/env.js'

let server

async function startServer() {
  try {
    await connectDB()
    server = app.listen(env.port, () => {
      console.log(`CarePoint API listening on port ${env.port}.`)
    })
  } catch (error) {
    console.error('Failed to start CarePoint API server:', error.message)
    process.exit(1)
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down CarePoint API.`)
  if (server) {
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  } else {
    await disconnectDB()
    process.exit(0)
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

startServer()
