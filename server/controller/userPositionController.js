const UserPosition = require('../model/userPositionModel');

const asyncFn = require('../utils/asyncFn');
const GlobalError = require('../utils/globalError');

exports.getOneUserPosition = asyncFn(async (req, res, next) => {
    const data = await UserPosition.findOne({ user: req.params.user }).lean();

    res.status(200).json({ data });
});

exports.getUserPosition = asyncFn(async (req, res, next) => {
    const userPosition = await UserPosition.find({ user: req.params.id })
        .populate('user', 'name mood')
        .lean();
    if (!userPosition) next(new GlobalError('cannot find user position (me)', 404));
    res.status(200).json({ data: userPosition[0] });
});

exports.deleteUserPosition = asyncFn(async (req, res, next) => {
    const user = await UserPosition.findOneAndDelete({ user: req.params.id });
    if (!user) next(new GlobalError('cannot find user to delete', 404));
    res.status(200).json({ message: 'position successfully delete' });
});

exports.updatePosition = asyncFn(async (req, res, next) => {
    const updatedPosition = await UserPosition.findOneAndUpdate(
        { user: req.params.id },
        { mood: req.body.mood },
        { new: true }
    );
    res.status(200).json({ updatedPosition });
});

exports.getUsersWithin = asyncFn(async (req, res, next) => {
    const data = await UserPosition.find({
        room: req.params.room,
        user: { $ne: req.params.id }
    })
        .populate({
            path: 'user'
        })
        .lean();
    const count = await UserPosition.find({
        room: req.params.room,
        user: { $ne: req.params.id }
    }).countDocuments();
    res.status(200).json({ data, count });
});
