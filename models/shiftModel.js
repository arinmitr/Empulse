const mongoose = require('mongoose')

const shiftSchema = new mongoose.Schema(
  {
    shiftName: {
      type: String,
      enum: ['First', 'Second', 'Third', 'General'],
    },
    shiftCode: {
      type: String,
      enum: ['F1', 'F2', 'F3', 'S1', 'S2', 'S3', 'T1', 'T2', 'T3'],
    },
    startDate: {
      type: Date,
      required: [true, 'Need start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Need end date'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Need a user for applying shift'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const Shifts = mongoose.model('Shifts', shiftSchema)

module.exports = Shifts
