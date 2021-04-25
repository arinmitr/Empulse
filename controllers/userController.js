const Users = require('./../models/userModel')

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).populate({
      path: 'shifts',
      select: 'shiftName shiftCode startDate endDate -_id -user',
    })

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'User not found',
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find()
    if (!users) throw 'No users found'
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.id
  next()
}

exports.getInfo = async (req, res) => {
  try {
    const user = await Users.findOne({ alias: req.body.alias }).populate({
      path: 'shifts',
      select: 'shiftName shiftCode startDate endDate _id -user',
    })

    if (!user) throw 'User not found'

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.getMyGroup = async (req, res) => {
  try {
    const myGroup = await Users.find({ supervisor: req.user.name }, 'name alias designation')
    res.status(200).json({
      status: 'success',
      data: {
        myGroup,
      },
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    })
  }
}

exports.getUserInfo = async (req, res) => {
  try {
    const userInfo = await Users.findOne({ alias: req.body.alias }, '-__v')
    if (!userInfo) throw 'No user found with this alias'

    res.status(200).json({
      status: 'success',
      data: userInfo,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.updateUserInfo = async (req, res) => {
  try {
    const user = await Users.findOneAndUpdate({ alias: req.body.alias }, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data: user,
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}
