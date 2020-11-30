const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        msg: { type: String },
        group: { type: String },
        privateRoom: { type: mongoose.Schema.ObjectId, ref: 'PrivateRoom' },
        sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
        receiver: { type: mongoose.Schema.ObjectId, ref: 'User' },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: '72h' }
        }
    },
    { timestamps: true, autoIndex: true }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
