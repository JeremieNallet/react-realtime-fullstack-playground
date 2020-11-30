const Chat = require('./../model/chatModel');
const asyncFn = require('./../utils/asyncFn');
const GlobalError = require('../utils/globalError');
const Notification = require('./../model/notificationModel');

// GET GROUPS
exports.getGroupMessages = asyncFn(async (req, res, next) => {
    const data = await Chat.find({ group: req.params.slug })
        .populate('sender', 'photo name')
        .select('-expireAt -updatedAt')
        .lean();
    if (!data) return next(new GlobalError('Group messages not found', 404));
    res.status(200).json({ data });
});

// GET PMS
exports.getPrivateMessages = asyncFn(async (req, res, next) => {
    const data = await Chat.find({
        $or: [
            { sender: req.params.id, receiver: req.params.receiver },
            { receiver: req.params.id, sender: req.params.receiver }
        ]
    })
        .populate('sender', 'name photo')
        .populate('receiver', 'name photo')
        .select('-expireAt')
        .lean();

    const exsistingNotification = await Notification.exists({
        receiver: req.params.receiver,
        sender: req.params.id,
        type: 'message'
    });
    if (!exsistingNotification) {
        return next(new GlobalError('Private cannot be retreived', 403));
    }
    res.status(200).json({ data });
});

// GET LOBBIES
exports.getLobbyMessages = asyncFn(async (req, res, next) => {
    const queryObj = {
        ...req.query,
        group: req.params.region
    };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Chat.find(JSON.parse(queryStr));

    if (req.query.sort) {
        query = query
            .sort(req.query.sort)
            .limit(50)
            .populate('sender', 'mood name')
            .select('-updatedAt')
            .lean();
    }
    const data = await query;

    const count = await Chat.find({ group: req.params.region })
        .countDocuments()
        .limit(50);
    if (!data) return next(new GlobalError('Lobby messages not found', 404));
    res.status(200).json({ data, count });
});
