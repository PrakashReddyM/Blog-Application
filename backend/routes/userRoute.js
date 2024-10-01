const express = require('express')
const { register, login, logout, getAllUsers, getUser, sendMail } = require('../controllers/userController')
const { isAuthenticated } = require('../middlewares/auth')
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/users').get(isAuthenticated,getAllUsers)
router.route('/user/:id').get(getUser)
router.route('/send-mail').post(sendMail)

module.exports = router;