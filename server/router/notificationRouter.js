const express = require('express');
const notificationController = require('../controller/notificationController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/sendWave', authController.protect, notificationController.sendWave);
router.post(
    '/sendWaveBack',
    authController.protect,
    notificationController.sendWaveBack
);
router.post(
    '/sendInvitation',
    authController.protect,
    notificationController.sendInvitation
);
router
    .route('/receivedNotification')
    .get(
        authController.protect,
        userController.getMe,
        notificationController.getReceivedNotifications
    );

router
    .route('/receivedMessages')
    .get(
        authController.protect,
        userController.getMe,
        notificationController.getReceivedMessages
    );

router
    .route('/check/:type/:userId')
    .get(
        authController.protect,
        userController.getMe,
        notificationController.checkDocument
    );
router
    .route('/:id')
    .patch(authController.protect, notificationController.markAsRead)
    .delete(authController.protect, notificationController.deleteOneNotification);

module.exports = router;
