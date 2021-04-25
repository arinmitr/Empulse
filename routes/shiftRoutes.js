const express = require('express')

const shiftController = require('./../controllers/shiftController')
const securityController = require('./../controllers/securityController')

const router = express.Router()

// Protect all routes
// Restrict to Supervisors

router
  .route('/create')
  .post(securityController.protect, securityController.RestrictTo('supervisor'), shiftController.createShift)
router
  .route('/view-user-daily-roster')
  .get(securityController.protect, securityController.RestrictTo('employee', 'supervisor'), shiftController.viewShift)
router
  .route('/view-user-monthly-roster')
  .get(
    securityController.protect,
    securityController.RestrictTo('employee', 'supervisor'),
    shiftController.viewMonthlyShift
  )
router
  .route('/update/:id')
  .patch(securityController.protect, securityController.RestrictTo('supervisor'), shiftController.updateShift)
router
  .route('/delete/:id')
  .delete(securityController.protect, securityController.RestrictTo('supervisor'), shiftController.deleteShift)

module.exports = router
