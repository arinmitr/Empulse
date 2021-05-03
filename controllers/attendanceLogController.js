const moment = require('moment-timezone')
const AttendanceLogs = require('./../models/attendanceLogModel')
const Users = require('./../models/userModel')
const Shifts = require('./../models/shiftModel')

const checkShift = (code, In, Out) => {
  let status = ''
  let T1 = new Date(In)
  let T2 = new Date(Out)
  T1 = T1.getHours()
  T2 = T2.getHours()
  switch (code) {
    case 'S3':
      if (T1 >= 12 && T1 <= 14 && T2 >= 21) status = 'Match'
      else status = 'Mismatch'
      break
    case 'T3':
      if (T1 >= 17 && T1 <= 19) status = 'Night Shift'
      else status = 'Mismatch'
      break
    default:
      status = 'Default'
  }
  return status
}

const checkCode = (entry, exit) => {
  let In1 = new Date(entry)
  let Out1 = new Date(exit)
  if (!In1 && !Out1) return 'AB'
  else if (!In1 || !Out1) return 'M'
  else if ((Out1 - In1) / 3600000 >= 9) return 'W+'
  else if ((Out1 - In1) / 3600000 < 9) return 'W-'
  else return 'M'
}

exports.createAttendance = async (req, res) => {
  try {
    req.body.user = req.user._id

    //Check if attendance already exists
    const checkAttendance = await AttendanceLogs.find({ user: req.body.user, date: req.body.date })
    if (checkAttendance.length > 0) throw 'Attendance already submitted'

    // Format In Time
    if (req.body.inTime) req.body.inTime = `${req.body.date}T${req.body.inTime}`

    //Check if Night Shift
    const shift = await Shifts.find({
      user: req.user.id,
      startDate: { $lte: req.body.date },
      endDate: { $gte: req.body.date },
    }).select('shiftCode')

    //Format Out Time if there is night shift accordingly
    if (req.body.outTime) {
      if (shift[0].shiftCode === 'T3') req.body.outTime = `${req.body.nextDay}T${req.body.outTime}`
      else req.body.outTime = `${req.body.date}T${req.body.outTime}`
    }

    //If no shift is defined, set to Default
    if (shift.length <= 0) req.body.shiftStatus = 'Default'
    //Check for shift timing match
    else req.body.shiftStatus = checkShift(shift[0].shiftCode, req.body.inTime, req.body.outTime)

    //Submit attendance
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
      message1: err,
      message2: err.message,
    })
  }
}

exports.approveAttendance = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')
    if (!user) throw 'User not found'
    let ID = user._id

    const updatedAttendance = await AttendanceLogs.findOneAndUpdate(
      { user: ID, date: req.body.date },
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      status: 'success',
      data: {
        updatedAttendance,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.viewAttendance = async (req, res) => {
  try {
    const attendance = await AttendanceLogs.find({ user: req.user._id }).select('-__v')

    if (attendance.length <= 0) throw '404'

    // let formattedResult = attendance.map((item, index) => {
    //   IN = moment(item.inTime).tz('Asia/Calcutta').format('HH:MM:SS')
    //   OUT = moment(item.outTime).tz('Asia/Calcutta').format('HH:MM:SS')
    //   let x = ''
    //   x = `{"Date":"${item.date.toLocaleString('en-us', {
    //     day: '2-digit',
    //     month: 'long',
    //     year: 'numeric',
    //   })}", "InTime":"${IN}", "OutTime":"${OUT}", "WorkingHours":${item.workingHours}, "RegularizationType":"${
    //     item.regularizationType
    //   }", "Code":"${item.code}","Status":"${item.status}"}`
    //   return JSON.parse(x)
    // })

    res.status(200).json({
      status: 'success',
      data: {
        attendance,
      },
    })
  } catch (err) {
    res.status(err).json({
      status: 'fail',
      message: 'No data found',
    })
  }
}

exports.updateAttendance = async (req, res) => {
  try {
    //Check if attendance is already approved
    const checkAttendance = await AttendanceLogs.find({ user: req.user.id, date: req.body.date }).select('status')
    if (checkAttendance[0].status === 'Approved') throw 'Attendance already approved'

    // Format In Time
    if (req.body.inTime) req.body.inTime = `${req.body.date}T${req.body.inTime}`

    //Check if Night Shift
    const shift = await Shifts.find({
      user: req.user.id,
      startDate: { $lte: req.body.date },
      endDate: { $gte: req.body.date },
    }).select('shiftCode')

    //Format Out Time if there is night shift accordingly
    if (req.body.outTime) {
      if (shift[0].shiftCode === 'T3') req.body.outTime = `${req.body.nextDay}T${req.body.outTime}`
      else req.body.outTime = `${req.body.date}T${req.body.outTime}`
    }

    //If no shift is defined, set to Default
    if (shift.length <= 0) req.body.shiftStatus = 'Default'
    //Check for shift timing match
    else req.body.shiftStatus = checkShift(shift[0].shiftCode, req.body.inTime, req.body.outTime)

    //Modify the attendance code
    req.body.code = checkCode(req.body.inTime, req.body.outTime)

    //Update attendance
    req.body.status = 'Pending'
    const updatedAttendance = await AttendanceLogs.findOneAndUpdate(
      { user: req.user.id, date: req.body.date },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      status: 'success',
      data: updatedAttendance,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.viewPendingAttendance_Supervisor = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')
    let ID = user._id
    if (!user) throw 'User not found'

    const pending = await AttendanceLogs.find({ user: ID, status: 'Pending' })

    res.status(200).json({
      status: 'success',
      results: pending.length,
      data: {
        pending,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.viewMonthlyAttendance = async (req, res) => {
  try {
    const month = req.body.month * 1

    const attendance = await AttendanceLogs.find({ user: req.user.id, $expr: { $eq: [{ $month: '$date' }, month] } })
    res.status(200).json({
      status: 'success',
      results: attendance.length,
      data: {
        attendance,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}
