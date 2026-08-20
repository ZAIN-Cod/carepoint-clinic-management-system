import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import AppError from '../utils/AppError.js'
import { generateToken } from '../utils/jwt.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new AppError('Please provide both email and password.', 400))
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')

    if (!user) {
      return next(new AppError('Invalid email or password.', 401))
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401))
    }

    const token = generateToken({ id: user._id, role: user.role })

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    })
  } catch (error) {
    next(error)
  }
}

export async function getMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(req, res) {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
