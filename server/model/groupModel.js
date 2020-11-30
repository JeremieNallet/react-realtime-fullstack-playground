const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: String,
        description: { type: String, maxlength: 721 },
        img: { type: String },
        address: { type: String, required: true },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            unique: [true, 'one group maximum per user']
        },
        totalMembers: { type: Number },
        room: { type: String, required: true },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: {
                type: [Number]
            }
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

groupSchema.index({ location: '2dsphere' });

groupSchema.virtual('members', {
    ref: 'Members',
    foreignField: 'groupInfo',
    localField: '_id'
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
