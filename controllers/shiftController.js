const Shifts = require('./../models/shiftModel')
const Users = require('./../models/userModel')

exports.createShift = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')

    if (!user) throw '404'
    req.body.user = user._id

    const shift = await Shifts.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        shift,
      },
    })
  } catch (err) {
    if (err === '404') {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      })
    } else {
      res.status(400).json({
        status: 'fail',
        message: err,
      })
    }
  }
}

exports.viewShift = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')

    if (!user) throw 'User not found'

    req.body.user = user._id

    const shift = await Shifts.find({
      user: req.body.user,
      startDate: { $lte: req.body.date },
      endDate: { $gte: req.body.date },
    }).select('shiftName shiftCode -_id')

    if (shift.length <= 0) throw 'No shift defined on this date'

    res.status(200).json({
      status: 'success',
      data: {
        shift,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.viewMonthlyShift = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }, '_id')

    if (!user) throw 'User not found'
    req.body.user = user._id
    const month = req.body.month
    const shift = await Shifts.aggregate([
      {
        $match: {
          user: req.body.user,
          startDate: { $gte: new Date(`2021-${month}-01`) },
          endDate: { $lte: new Date(`2021-${month}-31`) },
        },
      },
      {
        $group: {
          _id: { $toUpper: '$shiftCode' },
          shiftName: { $push: '$shiftName' },
          startDate: { $push: '$startDate' },
          endDate: { $push: '$endDate' },
        },
      },
    ])
    res.status(200).json({
      status: 'success',
      data: {
        shift,
      },
    })
  } catch (err) {}
}

exports.updateShift = async (req, res) => {
  try {
    const shift = await Shifts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!shift) throw 'No shift found'
    res.status(200).json({
      status: 'success',
      data: {
        shift,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shifts.findByIdAndDelete(req.params.id)

    if (!shift) throw 'No shift found with this id'

    res.status(204).json({
      status: 'success',
      dat: null,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}
