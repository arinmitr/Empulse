const express = require('express')

const attendanceLogController = require('../controllers/attendanceLogController')
const securityController = require('../controllers/securityController')

const router = express.Router()

router.route('/create').post(securityController.protect, attendanceLogController.createAttendance)
router.route('/view-attendance').get(securityController.protect, attendanceLogController.viewAttendance)
router
  .route('/view-pending-attendance')
  .get(
    securityController.protect,
    securityController.RestrictTo('supervisor'),
    attendanceLogController.viewPendingAttendance_Supervisor
  )
router.route('/view-monthly-attendance').get(securityController.protect, attendanceLogController.viewMonthlyAttendance)
router
  .route('/approve-attendance')
  .patch(
    securityController.protect,
    securityController.RestrictTo('supervisor'),
    attendanceLogController.approveAttendance
  )
router.route('/update-attendance').patch(securityController.protect, attendanceLogController.updateAttendance)

module.exports = router
