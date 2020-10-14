const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/api/restController')
const userController = require('../controllers/api/userController')
const businessController = require('../controllers/api/businessController')
const businessService = require('../services/businessService')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//passport middleware
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedBusiness = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'business') return next()
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//router
//basic
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/get_current_user', authenticated, userController.getUser)
router.get('/home', restController.getRestaurants)
router.get('/restaurant/:id', restController.getRestaurant)
router.get('/reservation/:id', restController.getMeals)

//common_user
router.post('/comment', authenticated, userController.postComment)
router.post('/reservation/:id', authenticated, userController.postReservation)
router.get('/member/:id/orders', authenticated, userController.getOrders)
router.put('/member/edit', authenticated, upload.single('image'), userController.putUser)
router.get('/member/info', authenticated, userController.getUserInfo)

//business_user
router.get('/business/restaurant', authenticated, authenticatedBusiness, businessController.getRestaurant)
router.get('/business/menu', authenticated, authenticatedBusiness, businessController.getMenu)
router.put('/business/:id/restaurant', authenticated, authenticatedBusiness, upload.single('image'), businessService.putRestaurant)
router.put('/business/:id/menu', authenticated, authenticatedBusiness, upload.single('image'), businessController.putMenu)

module.exports = router