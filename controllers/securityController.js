const Users = require('./../models/userModel')
const jwt = require('jsonwebtoken')

const signToken = (id) =>
  jwt.sign({ id }, 'my-ultra-secure-and-my-ultra-long-secret', {
    expiresIn: 24 * 3600,
  })

const sendCreateToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 3600 * 1000),
    httpOnly: true,
  }

  res.cookie('jwt', token, cookieOptions)

  res.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.login = async (req, res) => {
  try {
    const { alias, password } = req.body

    //If alias & password is not provided
    if (!alias || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Provide alias and password',
      })
    }

    //Check if user exists & password is correct
    const user = await Users.findOne({ alias: alias }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Email or Password',
      })
    }
    //If all ok, send token
    sendCreateToken(user, 200, res)
  } catch (err) {
    res.status(500).json({
      status: 'Something went wrong',
      message: err,
    })
  }
}

exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in',
      })
    }
    let decoded
    jwt.verify(token, 'my-ultra-secure-and-my-ultra-long-secret', (err, dec) => {
      if (err) return res.status(403)
      decoded = dec
    })

    const currentUser = await Users.findById(decoded.id)

    if (!currentUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'User with this token no longer exist',
      })
    }
    req.user = currentUser
    next()
  } catch (err) {
    res.status(500).json({
      status: 'Something went wrong!',
      message: err,
    })
  }
}

exports.RestrictTo = (...roles) => async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'Forbidden',
      message: 'Permission denied for this action',
    })
  }
  next()
}
