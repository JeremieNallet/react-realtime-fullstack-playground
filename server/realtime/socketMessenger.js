const Chat = require('../model/chatModel');
const Notification = require('../model/notificationModel');

module.exports = function(socket, messengerNS) {
    socket.on('MESSENGER_JOIN', ({ userID }) => socket.join(userID));

    //OPEN
    socket.on('MESSENGER_OPEN', async data => {
        try {
            const userNotification = await Notification.exists({
                sender: data.sender,
                receiver: data.receiver,
                type: 'message'
            });
            if (!userNotification) {
                await Notification.create({
                    sender: data.sender,
                    receiver: data.receiver,
                    type: 'message',
                    read: true
                });
            }
        } catch (err) {
            console.error(err, 'SOCKET: error while opening discussion');
        }
    });

    //SEND
    socket.on('MESSENGER_SEND_MSG', async (data, callback) => {
        const receivedAt = new Date().toISOString();
        const { receiver, sender, message } = data;
        try {
            const receiverNotification = await Notification.exists({
                sender: receiver,
                receiver: sender,
                type: 'message'
            });

            //-> if receiver has notification
            if (receiverNotification) {
                const chat = await Chat.create({
                    msg: message,
                    sender: sender,
                    receiver: receiver,
                    expireAt: null
                });
                const notification = await Notification.findOneAndUpdate(
                    { sender: receiver, receiver: sender, type: 'message' },
                    { lastMessage: chat.msg, read: false, receivedAt },
                    { new: true }
                );
                const receiverDoc = await Notification.findOneAndUpdate(
                    { sender: sender, receiver: receiver, type: 'message' },
                    { lastMessage: chat.msg, read: true },
                    { new: true }
                );
                messengerNS.to(receiver).emit('MESSENGER_RECEIVED_MSG', {
                    chat: chat,
                    lastMessage: receiverDoc.lastMessage,
                    notification: notification
                });
            } else {
                //-> if receiver has no notification
                const chat = await Chat.create({
                    msg: message,
                    sender: sender,
                    receiver: receiver,
                    expireAt: null
                });

                await Notification.create({
                    sender: receiver,
                    receiver: sender,
                    type: 'message',
                    lastMessage: chat.msg,
                    read: false,
                    receivedAt
                });

                await Notification.findOneAndUpdate(
                    { sender: sender, receiver: receiver, type: 'message' },
                    { lastMessage: chat.msg, read: true },
                    { new: true }
                );
                messengerNS.to(receiver).emit('MESSENGER_RECEIVED_MSG', chat);
            }
        } catch (err) {
            console.log(err, 'SOCKET: error while sending message ');
        }

        callback();
    });
};
