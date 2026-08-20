import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'receptionist'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
)

// Ensure passwordHash is never returned in JSON transformations
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash
    return ret
  },
})

export const User = mongoose.model('User', userSchema)
export default User
