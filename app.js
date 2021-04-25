const express = require('express')

const morgan = require('morgan')

const cookieParser = require('cookie-parser')

const userRouter = require('./routes/userRoutes')
const shiftRouter = require('./routes/shiftRoutes')
const attendanceRouter = require('./routes/attendanceRoutes')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(morgan('dev'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/shifts', shiftRouter)
app.use('/api/v1/attendance', attendanceRouter)

module.exports = app
