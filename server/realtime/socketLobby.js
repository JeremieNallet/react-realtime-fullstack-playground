const Chat = require('../model/chatModel');
const UserPosition = require('../model/userPositionModel');
const User = require('../model/userModel');

const {
    getUserFromLobby,
    addUserToLobby,
    deleteUserFromLobby
} = require('./manager');

const createPosition = async data => {
    try {
        await UserPosition.create({
            user: data.userId,
            location: { coordinates: [data.coords[0], data.coords[1]] },
            mood: data.emoji,
            room: data.spot
        });
        await User.findByIdAndUpdate(
            data.userId,
            { mood: data.emoji },
            { new: true }
        );
        await User.findByIdAndUpdate(
            data.userId,
            { location: { mood: data.emoji } },
            { new: true }
        );
    } catch (err) {
        console.error(err);
    }
};
const createMessage = async (data, user) => {
    try {
        let message = await Chat.create({
            msg: data.message,
            sender: data.userId,
            group: user.spot
        });
        message = await message.populate('sender').execPopulate();
        return message;
    } catch (err) {
        console.error(err);
    }
};

module.exports = function(socket, lobbyNS) {
    socket.on('LOBBY_JOIN', async data => {
        const { user, error } = addUserToLobby({ socketId: socket.id, ...data });

        if (error) return console.error('user already exist > lobby');
        if (data.createPosition) createPosition(data);

        socket.join(user.spot);
    });

    socket.on('LOBBY_SEND_MSG', async (data, cb) => {
        const { user } = getUserFromLobby(socket.id);
        const message = await createMessage(data, user);
        lobbyNS.to(user.spot).emit('LOBBY_RECEIVED_MSG', message);
        cb();
    });

    socket.on('disconnect', () => {
        const { user } = getUserFromLobby(socket.id);
        if (user) {
            deleteUserFromLobby(user.socketId);
            socket.leave(user.spot);
        }
    });
};
