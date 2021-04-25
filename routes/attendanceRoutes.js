const express = require('express')

const attendanceLogController = require('../controllers/attendanceLogController')
const securityController = require('../controllers/securityController')

const router = express.Router()

router.route('/create').post(securityController.protect, attendanceLogController.createAttendance)

module.exports = router