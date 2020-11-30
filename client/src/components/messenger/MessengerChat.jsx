import "./_Messenger.scss";
import React, { useState } from "react";

import ChatBig from "../chat/ChatBig";
import ChatMessage from "../chat/ChatMessage";
import ChatMobile from "../chat/ChatMobile";
import useResponsive from "../../hooks/useResponsive";
import { getUserProfile, getPrivateMessages } from "../../API";
import { useQuery } from "react-query";
import { useParams, useHistory } from "react-router";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { timeFromNow } from "../../utils/dates";
import Loader from "../shared/Loader";
import { messengerSocket } from "../../utils/sockets";

const MessengerChat = () => {
    const { isMobileScreen } = useResponsive();
    const MessengerChat = isMobileScreen ? ChatMobile : ChatBig;
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const { receiverID } = useParams();
    const { push } = useHistory();
    const { status } = useQuery(
        receiverID && ["GET_PRIVATE_MSG", receiverID],
        getPrivateMessages,
        {
            onSuccess: setMessages,
        }
    );

    const sendPrivateMessage = (e) => {
        if (userProfile && message && message.trim().length) {
            messengerSocket.emit(
                "MESSENGER_SEND_MSG",
                {
                    message,
                    sender: userProfile._id,
                    receiver: receiverID,
                },
                () => setMessage("")
            );
            // why not get the chat object from MESSENGER_RECEIVED_MSG ?
            // istead of creating one make more sense (just copy what you did on lobby chat)
            const msgObject = {
                _id: uuidv4(),
                msg: message,
                sender: userProfile,
                createdAt: new Date().toISOString(),
            };
            setMessages((msg) => [...msg, msgObject]);
        } else return;
    };

    useEffect(() => {
        messengerSocket.on("MESSENGER_RECEIVED_MSG", ({ chat }) => {
            setMessages((msg) => [...msg, chat]);
        });
    }, []);

    return (
        <>
            {status === "loading" ? (
                <div className="messenger__loading">
                    <Loader size="7" />
                </div>
            ) : status === "error" ? (
                <div>error</div>
            ) : (
                <MessengerChat
                    pickerCallback={(emoji) =>
                        setMessage((text) => text + emoji)
                    }
                    onSubmit={sendPrivateMessage}
                    onChange={({ target: { value } }) => setMessage(value)}
                    value={message}
                >
                    {messages.map((data) => (
                        <React.Fragment key={data._id}>
                            {userProfile && (
                                <ChatMessage
                                    goToProfile={() =>
                                        push(`/user/${data.sender._id}`)
                                    }
                                    imgSize="5"
                                    img={data.sender.photo}
                                    key={data._id}
                                    name={data.sender.name}
                                    tsp={timeFromNow(data.createdAt)}
                                    type={
                                        userProfile._id === data.sender._id
                                            ? "user"
                                            : null
                                    }
                                    text={data.msg}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </MessengerChat>
            )}
        </>
    );
};

export default MessengerChat;
