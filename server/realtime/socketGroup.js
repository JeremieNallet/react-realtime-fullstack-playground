const Chat = require('../model/chatModel');

const groupContainer = [];

const addUserToRoom = data => {
    const existingUser = groupContainer.find(user => user.uid === data.uid);

    if (existingUser) {
        return { error: 'user already exisit' };
    }
    const user = data;
    groupContainer.push(data);
    return { user };
};
const deleteUserFromRoom = socketId => {
    const index = groupContainer.findIndex(userSocket => userSocket.id === socketId);
    if (index !== -1) {
        return groupContainer.splice(index, 1)[0];
    }
};
const getUserFromRoom = id => {
    const user = groupContainer.find(user => user.id === id);
    return { user };
};

module.exports = function(socket, groupNS) {
    socket.on('GROUP_USER_JOINED', data => {
        const { user, error } = addUserToRoom({
            id: socket.id,
            name: data.name,
            room: data.room,
            uid: data.userId
        });
        if (error) return;

        socket.join(user.room);
    });

    socket.on('GROUP_MSG_SENT', async (data, callback) => {
        const { user } = getUserFromRoom(socket.id);

        let chat = await Chat.create({
            msg: data.message,
            sender: data.userId,
            group: user.room,
            expireAt: null
        });
        chat = await chat.populate('sender').execPopulate();

        groupNS.to(user.room).emit('GROUP_MSG_RECEIVED', chat);
        callback();
    });
    socket.on('disconnect', () => {
        const { user } = getUserFromRoom(socket.id);
        if (user) {
            socket.leave(user.room);
            deleteUserFromRoom(socket.id);
        }
    });
};
