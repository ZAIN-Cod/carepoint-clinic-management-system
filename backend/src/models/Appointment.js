import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
    clinician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinician',
      required: [true, 'Clinician reference is required'],
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Pending', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    department: {
      type: String,
      trim: true,
      default: 'General',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

appointmentSchema.index({ date: 1, clinician: 1 })
appointmentSchema.index({ patient: 1 })

export const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment
