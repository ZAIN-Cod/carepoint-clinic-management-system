import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    invoiceCode: {
      type: String,
      unique: true,
      trim: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
    service: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending',
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

export const Invoice = mongoose.model('Invoice', invoiceSchema)
export default Invoice
