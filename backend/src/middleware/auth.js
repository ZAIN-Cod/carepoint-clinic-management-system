import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { verifyToken } from '../utils/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication token is missing. Please log in.', 401))
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      return next(new AppError(err.message === 'Token expired' ? 'Session expired. Please log in again.' : 'Invalid authentication token.', 401))
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401))
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Access forbidden: You do not have permission to perform this action.', 403))
    }
    next()
  }
}
