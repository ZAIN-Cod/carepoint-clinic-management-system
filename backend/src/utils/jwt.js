import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function generateToken(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch (error) {
    throw new Error(error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token')
  }
}
