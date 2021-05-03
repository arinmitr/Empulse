const mongoose = require('mongoose')
const validator = require('validator')
const attendanceLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },
    inTime: {
      type: Date,
      default: null,
    },
    outTime: {
      type: Date,
      default: null,
      validate: {
        validator: function (val) {
          if (!val || !this.inTime) return true
          else return val >= this.inTime
        },
        message: 'Out Time should be greater than In Time',
      },
    },
    regularizationType: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['Swipe', 'Working from home', 'Working from client location', 'Business travel'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    code: {
      type: String,
      default: function () {
        if (!this.inTime && !this.outTime) return 'AB'
        else if (!this.inTime || !this.outTime) return 'M'
        else if ((this.outTime - this.inTime) / 3600000 >= 9) return 'W+'
        else if ((this.outTime - this.inTime) / 3600000 < 9) return 'W-'
        else return 'M'
      },
    },
    shiftStatus: {
      type: String,
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
  if (!this.inTime || !this.outTime) return 0
  else return (this.outTime - this.inTime) / 3600000
})

const AttendanceLogs = mongoose.model('AttendanceLogs', attendanceLogSchema)

module.exports = AttendanceLogs
