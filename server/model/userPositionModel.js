const mongoose = require('mongoose');

const userPositionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        unique: [true, 'users can only have one position']
    },
    mood: { type: String },
    room: { type: String },

    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    }
});

userPositionSchema.index({ location: '2dsphere' });

const UserPosition = mongoose.model('UserPosition', userPositionSchema);

module.exports = UserPosition;
