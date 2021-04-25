const moment = require('moment-timezone')
const AttendanceLogs = require('./../models/attendanceLogModel')
const Users = require('./../models/userModel')

exports.createAttendance = async (req, res) => {
  try {
    req.body.user = req.user._id

    req.body.inTime = `${req.body.date}T${req.body.inTime}`
    req.body.outTime = `${req.body.date}T${req.body.outTime}`

    const attendance = await AttendanceLogs.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        attendance,
      },
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}
