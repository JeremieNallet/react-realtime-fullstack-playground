const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            validate: [
                /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u,
                'Please provide a valid name'
            ],
            required: [true, 'Please tell us your name']
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            validate: [validator.default.isEmail, 'Please provide a valid email'],
            required: [true, 'Please provide an email']
        },
        password: {
            type: String,
            minlength: 8,
            select: false,
            required: [true, 'Please provide a password']
        },
        confirmPassword: {
            type: String,
            required: [true, 'Please confirm password'],
            validate: {
                validator: function(confirmPassword) {
                    return confirmPassword === this.password;
                },
                message: 'Password do not match.'
            }
        },
        description: { type: String, default: null, maxlength: 200 },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        photo: { type: String, default: null },
        hasGroup: { type: Boolean, default: false },
        groupInfo: { type: mongoose.Schema.ObjectId, ref: 'Group' },

        active: {
            type: Boolean,
            default: true,
            select: false
        },
        mood: { type: String, default: 'blue' },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },

    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

userSchema.virtual('membership', {
    ref: 'Members',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre(/^find/, async function(next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.comparePasswords = async function(typed, actual) {
    return await bcrypt.compare(typed, actual);
};
userSchema.methods.checkPasswordChanged = function(timestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return timestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
