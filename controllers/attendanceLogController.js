const moment = require('moment-timezone')
const AttendanceLogs = require('./../models/attendanceLogModel')
const Users = require('./../models/userModel')

exports.createAttendance = async (req, res) => {
  try {
    req.body.user = req.user._id
    console.log(req.body.user)

    if (req.body.inTime) req.body.inTime = `${req.body.date}T${req.body.inTime}`

    if (req.body.outTime) req.body.outTime = `${req.body.date}T${req.body.outTime}`

    const checkAttendance = await AttendanceLogs.find({ user: req.body.user, date: req.body.date })
    if (checkAttendance.length > 0) throw 'Attendance already submitted'

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

exports.viewAttendance = async (req, res) => {
  try {
    const attendance = await AttendanceLogs.find({ user: req.user._id }).select('-__v')

    if (attendance.length <= 0) throw '404'

    let formattedResult = attendance.map((item, index) => {
      IN = moment(item.inTime).tz('Asia/Calcutta').format('HH:MM:SS')
      OUT = moment(item.outTime).tz('Asia/Calcutta').format('HH:MM:SS')
      let x = ''
      x = `{"Date":"${item.date.toLocaleString('en-us', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })}", "InTime":"${IN}", "OutTime":"${OUT}", "WorkingHours":${item.workingHours}, "RegularizationType":"${
        item.regularizationType
      }", "Code":"${item.code}","Status":"${item.status}"}`
      return JSON.parse(x)
    })

    res.status(200).json({
      status: 'success',
      data: {
        formattedResult,
      },
    })
  } catch (err) {
    res.status(err).json({
      status: 'fail',
      message: 'No data found',
    })
  }
}
