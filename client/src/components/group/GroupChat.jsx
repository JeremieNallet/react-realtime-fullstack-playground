import "./_GroupChat.scss";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

//f -> older
import { getGroupMessage, getUserProfile } from "../../API";
import { timeFromNow } from "../../utils/dates";
import { useStore } from "../../store";
import { useHistory } from "react-router-dom";
import ChatBig from "../chat/ChatBig";
import ChatMessage from "../chat/ChatMessage";
import ChatMobile from "../chat/ChatMobile";
import useResponsive from "../../hooks/useResponsive";
import { Loader } from "../shared/Loader";
import EmptyText from "../shared/EmptyText";
import { groupSocket } from "../../utils/sockets";

const GroupChat = ({ slug }) => {
    const { push } = useHistory();
    const { isMobileScreen } = useResponsive();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [sucessfullyJoined, setSucessfullyJoined] = useState(false);
    const membershipRole = useStore((state) => state.membershipRole);
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);

    const { status } = useQuery(slug && ["GET_GROUP_MESSAGE", slug], getGroupMessage, {
        onSuccess: setMessages,
    });
    const GroupChat = isMobileScreen ? ChatMobile : ChatBig;

    const sendMessage = (e) => {
        if (membershipRole && sucessfullyJoined) {
            const { _id: userId } = userProfile;
            const onlySendIf = userId && message && message.trim().length;
            if (onlySendIf) {
                groupSocket.emit("GROUP_MSG_SENT", { message, userId }, () => setMessage(""));
            } else return;
        }
    };

    useEffect(() => {
        if (userProfile && !sucessfullyJoined) {
            const socketObject = { name: userProfile.name, room: slug, userId: userProfile._id };
            groupSocket.emit("GROUP_USER_JOINED", socketObject);
            setSucessfullyJoined(true);
        }
    }, [slug, sucessfullyJoined, userProfile]);

    useEffect(() => {
        groupSocket.connect();
        groupSocket.on("GROUP_MSG_RECEIVED", (msg) =>
            setMessages((messages) => [...messages, msg])
        );
        return () => {
            if (groupSocket) {
                groupSocket.disconnect();
                groupSocket.removeAllListeners();
            }
        };
    }, []);

    return (
        <div className={`group-chat ${isMobileScreen ? "m" : ""}`}>
            {status === "loading" ? (
                <div className="group-chat__loading">
                    <Loader size="8" />
                </div>
            ) : status === "error" ? (
                <div>error</div>
            ) : (
                <>
                    {!membershipRole ? (
                        <div className="group-chat__empty">
                            <EmptyText
                                action={() => push(`/group/${slug}`)}
                                text="Join the group to start chatting !"
                            />
                        </div>
                    ) : (
                        <GroupChat
                            pickerCallback={(emoji) => setMessage((text) => text + emoji)}
                            onSubmit={sendMessage}
                            onChange={({ target: { value } }) => setMessage(value)}
                            value={message}
                        >
                            {messages.map((data) => (
                                <ChatMessage
                                    name={data.sender.name}
                                    imgSize="4"
                                    key={data._id}
                                    img={data.sender.photo}
                                    tsp={timeFromNow(data.createdAt)}
                                    text={data.msg}
                                    type={
                                        userProfile && userProfile._id === data.sender._id
                                            ? "user"
                                            : "sender"
                                    }
                                    user={data.sender.name}
                                />
                            ))}
                        </GroupChat>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupChat;
