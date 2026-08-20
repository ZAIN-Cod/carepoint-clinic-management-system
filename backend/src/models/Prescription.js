import mongoose from 'mongoose'

const prescriptionSchema = new mongoose.Schema(
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
    medicationName: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Dosage instructions are required'],
      trim: true,
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    refills: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
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

export const Prescription = mongoose.model('Prescription', prescriptionSchema)
export default Prescription
