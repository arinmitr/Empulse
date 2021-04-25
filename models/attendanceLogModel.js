const mongoose = require('mongoose')

const attendanceLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },
    inTime: {
      type: Date,
      required: [true, 'In time is required'],
    },
    outTime: {
      type: Date,
      required: [true, 'Out time is required'],
    },
    regularizationType: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Working from home', 'Working from client location', 'Business travel'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    Note: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Need a user for applying attendance'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

attendanceLogSchema.virtual('workingHours').get(function () {
  return this.inTime - this.outTime
})

const AttendanceLogs = mongoose.model('AttendanceLogs', attendanceLogSchema)

module.exports = AttendanceLogs
