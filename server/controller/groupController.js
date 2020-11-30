const slugify = require('slugify');
const Members = require('../model/membersModel');
const Notification = require('../model/notificationModel');
const Group = require('./../model/groupModel');
const asyncFn = require('./../utils/asyncFn');
const User = require('../model/userModel');
const GlobalError = require('../utils/globalError');

exports.createOneGroup = async (req, res, next) => {
    let slug = slugify(req.body.title, {
        lower: true,
        remove: '.',
        replacement: '-'
    });
    const existingSlug = await Group.exists({ slug: slug });

    const addingNumberIfNameTaken = slug => {
        const slugNumber = slug.split('-')[1];
        let newNumber = Math.floor(Math.random() * 1000) + 1;
        if (slugNumber == newNumber) {
            newNumber += 1;
        }
        return newNumber;
    };

    if (existingSlug) {
        slug = `${slug}-${addingNumberIfNameTaken(slug)}`;
    }

    const group = await Group.create({
        createdBy: req.params.id,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        address: req.body.address,
        img: req.body.img,
        room: req.body.room,
        slug: slug
    });

    const members = await Members.create({
        user: req.params.id,
        groupInfo: group._id,
        accepted: true,
        role: 'admin',
        groupSlug: group.slug
    });

    const countMembers = await Members.find({
        groupSlug: group.slug,
        accepted: true
    }).countDocuments();

    const updateGroup = await Group.findOneAndUpdate(
        { _id: group._id },
        { totalMembers: countMembers },
        { new: true }
    );

    const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        { hasGroup: true },
        { new: true }
    );

    if (!members || !countMembers || !updateGroup || !updateUser) {
        return next(new GlobalError('Missing resources to complete creation', 424));
    }

    res.status(200).json({ slug: group.slug });
};
exports.deleteGroup = asyncFn(async (req, res, next) => {
    const group = await Group.findByIdAndDelete(req.params.param);
    await Members.deleteMany({ groupInfo: req.params.param });
    await User.findByIdAndUpdate(
        group.createdBy,
        { hasGroup: false },
        { new: true }
    );
    await Notification.deleteMany({ group: req.params.param });
    await Notification.deleteMany({
        type: 'invitation-accepted',
        sender: req.params.id
    });

    res.status(200).json({ status: 'group deleted success' });
});

exports.getOneGroup = asyncFn(async (req, res, next) => {
    const data = await Group.findOne({ slug: req.params.param })
        .select('-updatedAt -createdBy -createdAt')
        .lean();
    const groupMembers = await Members.find({
        groupInfo: data._id,
        accepted: true
    }).countDocuments();

    if (!data || !groupMembers) {
        return next(new GlobalError('cannot find group or members associated', 404));
    }

    res.status(200).json({ data, groupMembers });
});

exports.getUserGroup = asyncFn(async (req, res, next) => {
    const data = await Group.find({ createdBy: req.params.id })
        .select('location title')
        .lean();

    if (!data) {
        return next(new GlobalError('cannot find user group', 404));
    }

    res.status(200).json({ data: data[0] });
});

exports.updateGroup = asyncFn(async (req, res, next) => {
    const data = await Group.findOneAndUpdate(
        { slug: req.params.param },
        { title: req.body.title, description: req.body.description },
        { new: true, runValidators: true }
    );
    res.status(200).json({ data });
});

exports.getAllGroupsWithin = asyncFn(async (req, res, next) => {
    const { distance, latlng } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = distance / 3963.2;

    if (!lat || !lng) {
        next(new GlobalError('Please provide lat and lng in [lat,lng] format', 400));
    }

    // const members = await Members.find({grou})
    const queryObj = {
        ...req.query,
        room: req.params.room,
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Group.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
        query = query.sort(req.query.sort);
    }
    const totalGroups = await Group.find({
        room: req.params.room,
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    }).countDocuments();

    const mapData = await Group.find({
        createdBy: { $ne: req.params.id },
        room: req.params.room,
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
        .select('-updatedAt -createdAt -description -address')
        .lean();

    //pagination
    const resultPerPage = 7;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || resultPerPage;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const data = await query.select('-description -updatedAt -room -address').lean();

    const totalPages = Math.ceil(totalGroups / resultPerPage);

    res.status(200).json({
        data,
        mapData,
        totalGroups,
        totalPages
    });
});
