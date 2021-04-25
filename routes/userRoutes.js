const express = require('express')

const userController = require('./../controllers/userController')
const securityController = require('./../controllers/securityController')

const router = express.Router()

router.post('/login', securityController.login)

//Protect all routes
router.get('/emp-info-and-shift', securityController.protect, userController.getMe, userController.getUser)

//Restrict to Supervisor
router
  .route('/my-group-for-supervisors')
  .get(securityController.protect, securityController.RestrictTo('supervisor'), userController.getMyGroup)
router
  .route('/emp-info-for-supervisors')
  .get(securityController.protect, securityController.RestrictTo('supervisor'), userController.getInfo)

// Restrict to admin
router
  .route('/create')
  .post(securityController.protect, securityController.RestrictTo('admin'), userController.createUser)
router
  .route('/get-all-users')
  .get(securityController.protect, securityController.RestrictTo('admin'), userController.getAllUsers)
router
  .route('/get-user')
  .get(securityController.protect, securityController.RestrictTo('admin'), userController.getUserInfo)
router
  .route('/update')
  .patch(securityController.protect, securityController.RestrictTo('admin'), userController.updateUserInfo)

module.exports = router
