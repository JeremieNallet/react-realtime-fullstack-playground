const User = require('./../model/userModel');
const asyncFn = require('./../utils/asyncFn');
const GlobalError = require('./../utils/globalError');
const cloudinary = require('../utils/cloudinary');
const Chat = require('../model/chatModel');
const Notification = require('../model/notificationModel');
const Members = require('../model/membersModel');
const UserPosition = require('../model/userPositionModel');

const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.deletePhoto = asyncFn(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (user.photo) {
        await cloudinary.uploader.destroy(user.photo);
        await User.findByIdAndUpdate(user._id, { photo: null }, { new: true });
    }
    res.status(200).json({ status: 'photo deleted' });
});

exports.uploadPhoto = asyncFn(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (user.photo) {
        await cloudinary.uploader.destroy(user.photo);
    }
    const uploadResponse = await cloudinary.uploader.upload(req.body.photo);
    await User.findByIdAndUpdate(
        req.user.id,
        { photo: uploadResponse.public_id },
        { new: true }
    );
    res.status(200).json({ status: 'photo updated' });
});

exports.deleteUserData = asyncFn(async (req, res, next) => {
    await Chat.deleteMany({
        $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });
    await Notification.deleteMany({
        $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });
    await Members.deleteMany({ user: req.params.id });
    await UserPosition.findOneAndDelete({ user: req.params.id });
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(200).json({ status: 'user data deleted' });
});

exports.updateMe = asyncFn(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new GlobalError(
                'This route is not for password updates, please use upadate password'
            )
        );
    }
    const filteredBody = filterObj(
        req.body,
        'name',
        'email',
        'mood',
        'description',
        'active'
    );
    console.log(req.body);
    if (req.file) filteredBody.photo = req.file.filename;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        updatedUser
    });
});

exports.deleteUser = asyncFn(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        stauts: 'user delete !'
    });
});

exports.getPublicUser = asyncFn(async (req, res, next) => {
    const data = await User.findById(req.params.id)
        .select('name description')
        .lean();
    res.status(200).json({ data });
});

exports.getUser = asyncFn(async (req, res, next) => {
    //if memebrship needed
    // const data = await User.findById(req.params.id)
    //     .populate({
    //         path: 'membership',
    //         populate: { path: 'groupInfo', populate: 'members' }
    //     })
    //     .lean();

    const data = await User.findById(req.params.id)
        .select('-createdAt -updatedAt -role')
        .lean();

    res.status(200).json({ data });
});
