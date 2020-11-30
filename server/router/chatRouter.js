const express = require('express');
const chatController = require('../controller/chatController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/group/:slug', authController.protect, chatController.getGroupMessages);
router.get(
    '/lobby/:region',
    authController.protect,
    chatController.getLobbyMessages
);
router.get(
    '/pm/:receiver',
    authController.protect,
    userController.getMe,
    chatController.getPrivateMessages
);
module.exports = router;
