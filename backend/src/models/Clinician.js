import mongoose from 'mongoose'

const clinicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinician name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Clinician email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    initials: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Clinician = mongoose.model('Clinician', clinicianSchema)
export default Clinician
