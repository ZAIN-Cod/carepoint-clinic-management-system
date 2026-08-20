import mongoose from 'mongoose'

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
    clinician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinician',
    },
    recordType: {
      type: String,
      enum: ['Radiology', 'Lab Test', 'Procedure Note', 'Vaccination', 'Clinical Summary'],
      default: 'Procedure Note',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Final', 'Draft', 'Archived'],
      default: 'Final',
    },
  },
  {
    timestamps: true,
  }
)

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)
export default MedicalRecord
