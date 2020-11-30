const Notification = require('../model/notificationModel');
const asyncFn = require('../utils/asyncFn');

exports.getReceivedNotifications = asyncFn(async (req, res, next) => {
    let query = Notification.find({
        receiver: req.params.id,
        type: { $ne: 'message' }
    })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .populate('group', { _id: 1, slug: 1 })
        .select('-unique');

    const resultPerPage = 10;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || resultPerPage;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    const data = await query.lean();

    const countNotifications = await Notification.find({
        receiver: req.params.id,
        read: false,
        type: { $ne: 'message' }
    }).countDocuments();

    //conditioning next page
    const countAllData = await Notification.find({
        receiver: req.params.id,
        type: { $ne: 'message' }
    }).countDocuments();

    const totalPages = Math.ceil(countAllData / resultPerPage);
    let nextPage = req.query.page * 1 || 1;
    if (page !== totalPages) nextPage += 1;
    else nextPage = false;

    res.status(200).json({ data, nextPage, count: countNotifications });
});

exports.getReceivedMessages = asyncFn(async (req, res, next) => {
    let query = Notification.find({
        sender: req.params.id,
        type: 'message'
    })
        .populate('sender', 'name photo')
        .populate('receiver', 'name photo')
        .select('-unique');

    const resultPerPage = 10;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || resultPerPage;
    const skip = (page - 1) * limit;

    if (req.query.sort) {
        query = query.sort(req.query.sort);
    }

    query = query.skip(skip).limit(limit);

    const data = await query.lean();

    const countNotifications = await Notification.find({
        sender: req.params.id,
        read: false,
        type: 'message'
    }).countDocuments();

    //conditioning next page
    const countAllData = await Notification.find({
        sender: req.params.id,
        type: 'message'
    }).countDocuments();

    const totalPages = Math.ceil(countAllData / resultPerPage);
    let nextPage = req.query.page * 1 || 1;
    if (page !== totalPages) nextPage += 1;
    else nextPage = false;

    res.status(200).json({
        data,
        nextPage,
        count: countNotifications
    });
});

exports.deleteOneNotification = asyncFn(async (req, res, next) => {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ ok: true });
});

exports.markAsRead = asyncFn(async (req, res, next) => {
    await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
    ).lean();
    res.status(200).json({ status: 'success' });
});

exports.checkDocument = asyncFn(async (req, res, next) => {
    const { userId, type, id } = req.params;

    if (type === 'wave') {
        const waveExists = await Notification.exists({
            $or: [
                { sender: id, receiver: userId, type: 'wave' },
                { sender: id, receiver: userId, type: 'wave-notice' },
                { sender: userId, receiver: id, type: 'wave' },
                { sender: userId, receiver: id, type: 'wave-notice' }
            ]
        });
        res.status(200).json({ waveExists });
    }
    if (type === 'invitation') {
        const invitationExists = await Notification.exists({
            sender: id,
            receiver: userId,
            type: 'invitation'
        });
        res.status(200).json({ invitationExists });
    }
});

exports.sendWaveBack = asyncFn(async (req, res, next) => {
    const { notificationId, receiverId, senderId } = req.body;
    await Notification.findByIdAndUpdate(
        notificationId,
        { type: 'wave-notice', read: true },
        { new: true }
    );
    await Notification.findOneAndUpdate(
        { sender: senderId, receiver: receiverId, type: 'wave-notice' },
        { type: 'wave', read: false },
        { new: true }
    );
    res.status(200).json({ status: 'success' });
});

exports.sendWave = asyncFn(async (req, res, next) => {
    const { sender, receiver } = req.body;
    await Notification.create({
        sender,
        receiver,
        type: 'wave'
    });
    await Notification.create({
        sender: receiver,
        receiver: sender,
        type: 'wave-notice',
        read: true
    });

    // res.status(200).json({ status: 'success' });
});

exports.sendInvitation = asyncFn(async (req, res, next) => {
    const { sender, receiver, groupId } = req.body;
    await Notification.create({
        sender: sender,
        receiver: receiver,
        group: groupId,
        type: 'invitation'
    });

    const doc = await Notification.findOneAndUpdate(
        {
            $or: [
                { sender: receiver, receiver: sender, type: 'invitation-notice' },
                { sender: receiver, receiver: sender, type: 'invitation-accepted' }
            ]
        },
        { read: true, type: 'invitation-notice' },
        { new: true }
    );
    if (!doc) {
        await Notification.create({
            sender: receiver,
            receiver: sender,
            read: true,
            group: groupId,
            type: 'invitation-notice'
        });
    }
    res.status(200).json({ status: 200 });
});
