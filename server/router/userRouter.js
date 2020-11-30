const express = require('express');

const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router
    .route('/public/:id')
    .get(authController.protect, userController.getPublicUser);

router.use(authController.protect);

router.get('/profile', userController.getMe, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateProfile', userController.updateMe);

router.delete(
    '/deleteUserData',
    authController.protect,
    userController.getMe,
    userController.deleteUserData
);

router
    .route('/userPhoto')
    .patch(authController.protect, userController.getMe, userController.uploadPhoto)
    .delete(
        authController.protect,
        userController.getMe,
        userController.deletePhoto
    );

module.exports = router;
