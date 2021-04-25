const mongoose = require('mongoose')
const moment = require('moment-timezone')

const timeZone = moment.tz.guess()

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
    timeZone: {
      type: String,
      default: timeZone,
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

// attendanceLogSchema.virtual('IN').get(function () {
//   return moment().tz(this.inTime, this.timeZone).format()
// })

// attendanceLogSchema.virtual('OUT').get(function () {
//   return moment().tz(this.outTime, this.timeZone).format()
// })

attendanceLogSchema.virtual('workingHours').get(function () {
  return (this.outTime - this.inTime) / 3600000
})

const AttendanceLogs = mongoose.model('AttendanceLogs', attendanceLogSchema)

module.exports = AttendanceLogs
