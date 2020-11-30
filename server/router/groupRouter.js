const express = require('express');

const groupController = require('../controller/groupController');
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');

const router = express.Router();

router.get(
    '/me',
    authController.protect,
    userController.getMe,
    groupController.getUserGroup
);
router.get(
    '/groups-list/:room/:distance/:latlng',
    authController.protect,
    userController.getMe,
    groupController.getAllGroupsWithin
);

router
    .route('/')
    .post(
        authController.protect,
        userController.getMe,
        groupController.createOneGroup
    );

router
    .route('/:param')
    .get(groupController.getOneGroup)
    .delete(
        authController.protect,
        userController.getMe,
        groupController.deleteGroup
    )
    .patch(authController.protect, groupController.updateGroup);

module.exports = router;
