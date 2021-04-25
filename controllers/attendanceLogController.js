const AttendanceLogs = require('./../models/attendanceLogModel')
const Users = require('./../models/userModel')

exports.createAttendance = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')

    if (!user) throw '404'
    req.body.user = user._id

    const attendance = await AttendanceLogs.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        attendance
      }
    })


  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}
