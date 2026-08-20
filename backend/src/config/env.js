import 'dotenv/config'

function readPort(value) {
  const port = Number.parseInt(value ?? '5000', 10)

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port number.')
  }

  return port
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: readPort(process.env.PORT),
  clientUrl: process.env.CLIENT_URL ?? process.env.FRONTEND_URL ?? 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL ?? process.env.CLIENT_URL ?? 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'carepoint_dev_secret_key_change_in_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  seedAdminName: process.env.SEED_ADMIN_NAME ?? 'Admin User',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? 'admin@carepoint.com',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? 'AdminPass123!',
})
