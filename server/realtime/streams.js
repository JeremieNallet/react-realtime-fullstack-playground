module.exports = function(connection, { lobbyNS, messengerNS, notificationNS }) {
    const notificationStream = connection.collection('notifications').watch();
    const groupStream = connection.collection('groups').watch();
    const positionStream = connection.collection('userpositions').watch();
    const chatStream = connection.collection('chats').watch();
    notificationStream.on('change', () => {
        messengerNS.emit('NOTIFICATIONS_UPDATE');
        notificationNS.emit('NOTIFICATIONS_UPDATE');
    });
    groupStream.on('change', doc => {
        if (doc.operationType === 'insert') {
            lobbyNS.emit('LOBBY_GROUP_ADDED', { position: doc.fullDocument });
        }
        if (doc.operationType === 'delete') {
            lobbyNS.emit('LOBBY_GROUP_DELETED', { docId: doc.documentKey._id });
        }
    });
    positionStream.on('change', doc => {
        if (doc.operationType === 'insert') {
            lobbyNS.emit('LOBBY_POSITION_ADDED', { position: doc.fullDocument });
        }
        if (doc.operationType === 'delete') {
            lobbyNS.emit('LOBBY_POSITION_DELETED', { docId: doc.documentKey._id });
        }
    });
    chatStream.on('change', doc => {
        if (doc.operationType === 'insert') {
            if (doc.fullDocument.type === 'lobby') lobbyNS.emit('LOBBY_NEW_MSG');
        }
    });
};
