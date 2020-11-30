const Members = require('../model/membersModel');
const Group = require('../model/groupModel');
const asyncFn = require('../utils/asyncFn');
const GlobalError = require('./../utils/globalError');
const Notification = require('../model/notificationModel');

const updateMembersCount = async (member, groupSlug) => {
    if (member) {
        const total = await Members.find({
            groupSlug: groupSlug,
            accepted: true
        }).countDocuments();
        await Group.findOneAndUpdate(
            { slug: groupSlug },
            { totalMembers: total },
            { new: true }
        );
    }
};

exports.createOneMember = asyncFn(async (req, res, next) => {
    const { groupInfo, groupSlug, isInvitation, sender, notificationId } = req.body;
    const existingMember = await Members.find({
        $and: [{ user: req.params.id }, { groupInfo: groupInfo }]
    });
    if (Array.isArray(existingMember) && existingMember.length) {
        return next(new GlobalError('member already exisit', 400));
    }
    const data = await Members.create({
        user: req.params.id,
        groupInfo: groupInfo,
        groupSlug: groupSlug,
        role: 'member'
    });
    updateMembersCount(data, groupSlug);

    if (isInvitation) {
        await Notification.findByIdAndDelete(notificationId);
        const doc = await Notification.findOneAndUpdate(
            { receiver: sender, sender: req.params.id, type: 'invitation-notice' },
            { type: 'invitation-accepted', read: false },
            { new: true }
        );
        if (!doc) {
            await Notification.create({
                receiver: sender,
                sender: req.params.id,
                type: 'invitation-accepted',
                read: false
            });
        }
    }
    res.status(200).json({ status: 'success' });
});

exports.getAllGroupMembers = asyncFn(async (req, res, next) => {
    let query = Members.find({
        groupSlug: req.params.groupSlug,
        accepted: true
    }).populate('user', 'name photo description');

    const resultPerPage = 10;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || resultPerPage;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    const data = await query.lean();

    const count = await Members.find({
        groupSlug: req.params.groupSlug,
        accepted: true
    }).countDocuments();

    const totalPages = Math.ceil(count / resultPerPage);
    let nextPage = req.query.page * 1 || 1;
    if (page !== totalPages) nextPage += 1;
    else nextPage = false;

    res.status(200).json({
        data,
        nextPage,
        count
    });
});

exports.removeOneMembership = asyncFn(async (req, res, next) => {
    const member = await Members.findOneAndDelete({
        user: req.params.id,
        groupSlug: req.params.groupSlug
    });
    if (!member) return next(new GlobalError('cannot find member', 404));
    updateMembersCount(member, req.params.groupSlug);
    res.status(200).json({ status: 'success' });
});
exports.kickOneMember = asyncFn(async (req, res, next) => {
    const member = await Members.findByIdAndDelete(req.params.userId);
    if (!member) return next(new GlobalError('cannot find member', 404));
    updateMembersCount(member, req.params.groupSlug);
    res.status(200).json({ status: 'success' });
});

exports.getOneUserMembership = asyncFn(async (req, res, next) => {
    const data = await Members.findOne({
        user: req.params.id,
        groupSlug: req.params.groupSlug
    })
        .select('role')
        .lean();

    res.status(200).json({ data });
});

exports.getAllUserMemberships = asyncFn(async (req, res, next) => {
    let query = Members.find({
        user: req.params.id,
        accepted: true
    })
        .populate({
            path: 'groupInfo',
            select: 'title img slug'
        })
        .select('role');

    const resultPerPage = 5;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || resultPerPage;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const data = await query.lean();
    const count = await Members.find({
        user: req.params.id,
        accepted: true
    }).countDocuments();
    const totalPages = Math.ceil(count / resultPerPage);
    let nextPage = req.query.page * 1 || 1;

    if (page !== totalPages) {
        nextPage += 1;
    } else {
        nextPage = false;
    }

    res.status(200).json({ data, totalPages, count: count, nextPage });
});

exports.checkMemberExists = asyncFn(async (req, res, next) => {
    const userGroup = await Group.findOne({ createdBy: req.params.id })
        .select('_id')
        .lean();
    if (userGroup) {
        const memberExists = await Members.exists({
            groupInfo: userGroup._id,
            user: req.params.userId
        });
        res.status(200).json({ memberExists });
    }
});
