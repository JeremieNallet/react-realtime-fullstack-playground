const express = require('express');
const membersController = require('../controller/membersController');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/check/:userId')
    .get(
        authController.protect,
        userController.getMe,
        membersController.checkMemberExists
    );

router
    .route('/membership/:groupSlug')
    .get(
        authController.protect,
        userController.getMe,
        membersController.getOneUserMembership
    );

router
    .route('/kick/:userId/:groupSlug')
    .delete(authController.protect, membersController.kickOneMember);

router
    .route('/')
    .post(
        authController.protect,
        userController.getMe,
        membersController.createOneMember
    );

router
    .route('/userMembership/:id')
    .get(authController.protect, membersController.getAllUserMemberships);

router
    .route('/:groupSlug')
    .get(authController.protect, membersController.getAllGroupMembers)
    .delete(
        authController.protect,
        userController.getMe,
        membersController.removeOneMembership
    );

module.exports = router;
