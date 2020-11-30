// => dependencies

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(helmet());

const globalLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5000,
    message: 'Too many request from this IP, please try again later'
});

app.use('/api/', globalLimiter);

const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingInterval: 5000, pingTimeout: 10000 });

// => folders
const GlobalError = require('./utils/globalError');
const errorHandler = require('./utils/errorHandler');
const userRouter = require('./router/userRouter');
const groupRouter = require('./router/groupRouter');
const chatRouter = require('./router/chatRouter');
const userPositionRouter = require('./router/userPositionRouter');
const authRouter = require('./router/authRouter');
const membersRouter = require('./router/membersRouter');
const notificationRouter = require('./router/notificationRouter');

const groupNS = io.of('/groups');
const lobbyNS = io.of('/lobby');
const messengerNS = io.of('/messenger');
const notificationNS = io.of('/notification');

dotenv.config({ path: './config.env' });

// => middlewares

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanatize());
app.use(xss());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('DEVELOPEMENT MODE');
} else if (process.env.NODE_ENV === 'production') {
    console.log('PRODUCTON MODE');
}

// => Database && server

const prodURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_DROPLET_IP}:27017/${process.env.MONGO_DB}?authSource=admin`;
const devURL = `mongodb://localhost:27017/stumbly`;
const DATABASE = process.env.NODE_ENV === 'development' ? devURL : prodURL;

mongoose
    .connect(DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('connected to database'));

const { connection } = mongoose;

connection.once('open', () => {
    require('./realtime/streams')(connection, {
        lobbyNS,
        messengerNS,
        notificationNS
    });
});

messengerNS.on('connection', socket => {
    require('./realtime/socketMessenger')(socket, messengerNS);
});

groupNS.on('connection', socket => {
    require('./realtime/socketGroup')(socket, groupNS);
});

lobbyNS.on('connection', socket => {
    require('./realtime/socketLobby')(socket, lobbyNS);
});

// => routes
app.use(express.static('public'));
app.use('/static', express.static('public'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/members', membersRouter);
app.use('/api/v1/userPosition', userPositionRouter);
app.use('/api/v1/notifications', notificationRouter);

app.all('*', (req, res, next) => {
    next(new GlobalError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);
server.listen(process.env.PORT, () => console.log(`running at ${process.env.PORT}`));
