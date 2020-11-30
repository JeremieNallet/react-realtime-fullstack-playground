const { promisify } = require('util');
const { OAuth2Client } = require('google-auth-library');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');

const GlobalError = require('./../utils/globalError');
const asyncFn = require('./../utils/asyncFn');
const Email = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });
};

const createAndSendToken = (data, statusCode, res) => {
    const token = signToken(data._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    data.password = undefined;
    res.status(statusCode).json({ token, data });
};

exports.signup = asyncFn(async (req, res, next) => {
    const data = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        confirmPassword: req.body.password
    });

    if (process.env.NODE_ENV !== 'production') {
        const url = `http://localhost:3000/signin`;
        await new Email(data, url).sendWelcome();
    } else {
        const url = `https://app.stumbly.io/signin`;
        await new Email(data, url).sendWelcome();
    }

    createAndSendToken(data, 201, res);
});

exports.login = asyncFn(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new GlobalError('Field required', 400));

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePasswords(password, user.password))) {
        console.log('this block');
        return next(new GlobalError('Incorect password or email.', 400));
    }
    createAndSendToken(user, 200, res);
});

exports.signout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = asyncFn(async (req, res, next) => {
    let token;
    const { authorization: header } = req.headers;
    if (header && header.startsWith('Bearer')) token = header.split(' ')[1];
    if (!token) return next(new GlobalError('Unauthorized, please login', 401));

    //check if no know alltered the token!
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //if there a current user ?
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new GlobalError('user does not exists', 401));

    //was password changed ?
    if (currentUser.checkPasswordChanged(decoded.iat)) {
        return next(new GlobalError('password was changed loggin reequired', 401));
    }

    req.user = currentUser;
    next();
});

exports.onlyFor = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new GlobalError('Unauthorized action', 403));
        }
        next();
    };
};

exports.forgotPassword = asyncFn(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new GlobalError('No user with that email', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        if (process.env.NODE_ENV !== 'production') {
            const resetURL = `http://localhost:3000/reset/${resetToken}`;
            await new Email(user, resetURL).sendPasswordReset();
        } else {
            const resetURL = `https://app.stumbly.io/reset/${resetToken}`;
            await new Email(user, resetURL).sendPasswordReset();
        }
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new GlobalError('There was an error sending the email, try later', 500)
        );
    }

    res.status(200).json({ user });
});

exports.resetPassword = asyncFn(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
        return next(new GlobalError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createAndSendToken(user, 200, res);
});

exports.updatePassword = asyncFn(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePasswords(req.body.currentPassword, user.password))) {
        return next(new GlobalError('current password is wrong', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    createAndSendToken(user, 200, res);
});

exports.accessWithGooqle = asyncFn(async (req, res, next) => {
    const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const idToken = req.body.tokenId;
    const { payload } = await googleAuthClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const { email_verified, name, email, jti } = payload;

    if (email_verified) {
        const user = await User.findOne({ email });
        const password = jti + process.env.JWT_SECRET;
        if (user) {
            createAndSendToken(user, 200, res);
        } else {
            const newUser = await User.create({
                name: name,
                email: email,
                password: password,
                confirmPassword: password
            });
            createAndSendToken(newUser, 201, res);
        }
    } else {
        return next(new GlobalError('wrong google credentials', 401));
    }
});
