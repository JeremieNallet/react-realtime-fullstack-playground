const mongoose = require('mongoose');

const membersModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        groupInfo: { type: mongoose.Schema.ObjectId, ref: 'Group' },
        accepted: { type: Boolean, default: true },
        groupSlug: { type: String },
        role: {
            type: String,
            enum: ['member', 'admin', null],
            default: 'invited-member'
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

const Members = mongoose.model('Members', membersModel);

module.exports = Members;
