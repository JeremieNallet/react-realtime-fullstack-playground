const express = require('express');
const userPositionController = require('../controller/userPositionController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();
router
    .route('/user/:user')
    .get(authController.protect, userPositionController.getOneUserPosition);

router
    .route('/user-by-room/:room')
    .get(
        authController.protect,
        userController.getMe,
        userPositionController.getUsersWithin
    );

router.delete(
    '/deleteMe',
    authController.protect,
    userController.getMe,
    userPositionController.deleteUserPosition
);
router.patch(
    '/updateMe',
    authController.protect,
    userController.getMe,
    userPositionController.updatePosition
);
router.get(
    '/me',
    authController.protect,
    userController.getMe,
    userPositionController.getUserPosition
);

module.exports = router;
