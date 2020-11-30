const groupContainer = [];
const lobbyContainer = [];

const addUserToLobby = user => {
    const alreadyExsist = lobbyContainer.find(el => el.socketId === user.socketId);
    if (alreadyExsist) return { error: 'user is aleady in lobby' };
    lobbyContainer.push(user);
    return { user };
};
const deleteUserFromLobby = id => {
    const index = lobbyContainer.findIndex(el => el.socketId === id);
    if (index !== -1) {
        return lobbyContainer.splice(index, 1)[0];
    }
};
const getUserFromLobby = socketId => {
    const user = lobbyContainer.find(el => el.socketId === socketId);

    return { user };
};

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
const getUserFromRoom = id => groupContainer.find(user => user.id === id);

module.exports = {
    groupContainer,
    addUserToRoom,
    deleteUserFromRoom,
    getUserFromRoom,
    addUserToLobby,
    deleteUserFromLobby,
    getUserFromLobby,
    lobbyContainer
};
