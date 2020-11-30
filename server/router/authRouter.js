const express = require('express');
const rateLimiter = require('express-rate-limit');
const authController = require('./../controller/authController');

const router = express.Router();
const authLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'Too many attempts, please wait 5 minutes'
});

router.post('/signup', authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/signout', authController.signout);

router.post('/forgotpassword', authLimiter, authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.post('/google', authController.accessWithGooqle);

module.exports = router;
