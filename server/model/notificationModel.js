const mongoose = require('mongoose');

const notificationModel = new mongoose.Schema(
    {
        receiver: { type: mongoose.Schema.ObjectId, ref: 'User' },
        sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
        read: { type: Boolean, default: false },
        lastMessage: { type: String },
        room: { type: String },
        group: { type: mongoose.Schema.ObjectId, ref: 'Group' },
        receivedAt: { type: Date },
        type: {
            type: String,
            enum: [
                'invitation',
                'wave',
                'message',
                'wave-notice',
                'invitation-notice',
                'invitation-accepted'
            ],
            default: 'invitation'
        },
        unique: { type: String, unique: true }
    },
    { timestamps: true }
);

notificationModel.pre('save', function(next) {
    this.unique = `${this.sender}-${this.receiver}-${this.type}`;
    next();
});

const Notifications = mongoose.model('Notifications', notificationModel);

module.exports = Notifications;
