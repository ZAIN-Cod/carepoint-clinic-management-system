import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    patientCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Other',
    },
    address: {
      type: String,
      trim: true,
    },
    medicalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

patientSchema.set('toJSON', { virtuals: true })

export const Patient = mongoose.model('Patient', patientSchema)
export default Patient
