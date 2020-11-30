import "./_DashboardChat.scss";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

//folder
import { getUserProfile, getLobbyMessages } from "../../API";
import ChatFloating from "../chat/ChatFloating";
import ChatMessage from "../chat/ChatMessage";
import { useStore } from "../../store";
import { timeFromNow } from "../../utils/dates";
import ChatMobile from "../chat/ChatMobile";
import { axios } from "../../API";
import { lobbySocket } from "../../utils/sockets";
import { Cross } from "../../assets/svgs/icons";
import { IconBtn } from "../shared/Buttons";
import { truncate } from "lodash";
import Loader from "../shared/Loader";
import useResponsive from "../../hooks/useResponsive";

const DashboardChat = ({ mobile = false, allUsers }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const setPannel = useStore((state) => state.setPannel);
    const user = useStore((state) => state.user);
    const updateViewport = useStore((state) => state.updateViewport);
    const pannel = useStore((state) => state.pannel);
    const { data: userProfile, statusA } = useQuery("GET_USER_PROFILE", getUserProfile);
    const { isMobileScreen } = useResponsive()

    const { refetch } = useQuery(["GET_LOBBY_MESSAGES", user.spot], getLobbyMessages, {
        onSuccess: (data) => setMessages(data.data),
        onError: (err) => console.error(err, "couldn't fetch lobby messages."),
    });

    const onSend = () => {
        if (message && message.trim().length && userProfile) {
            if (messages.length >= 50) refetch();
            const socketObj = { message, userId: userProfile._id, emoji: userProfile.mood };
            lobbySocket.emit("LOBBY_SEND_MSG", socketObj, () => setMessage(""));
        }
    };
    useEffect(() => {
        lobbySocket.on("LOBBY_RECEIVED_MSG", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });
    }, [setMessages]);


    useEffect(() => {
        if (isMobileScreen) setPannel("chat", false);
    }, [isMobileScreen, setPannel]);


    const findUser = async (id, closePannel) => {
        try {
            const { data } = await axios.get(`/userPosition/user/${id}`);
            if (!data) return;
            const [longitude, latitude] = data.data.location.coordinates;
            updateViewport({ latitude, longitude, zoom: 20 });
            closePannel();
        } catch (err) {
            console.error(err);
        }
    };
    const onUserEmojiClick = async (id) => {
        findUser(id, () => setPannel("chat", false));

    };

    const sorted = [...messages].sort((recordA, recordB) => {
        const convertedDate = (record) => new Date(record.createdAt).getTime();
        return convertedDate(recordA) - convertedDate(recordB);
    });

    return (
        <>
            {pannel.chat && (
                <>
                    {!mobile && (
                        <ChatFloating
                            pickerCallback={(emoji) => setMessage((text) => text + emoji)}
                            countUsers={allUsers.length}
                            onClick={() => setPannel("chat", false)}
                            onSubmit={onSend}
                            onChange={({ target: { value } }) => setMessage(value)}
                            value={message}
                        >
                            {statusA === "loading" ? (
                                <div className="dashboard-chat__loading">
                                    <Loader />
                                </div>
                            ) : statusA === "error" ? (
                                <div>error</div>
                            ) : (
                                        <>
                                            {sorted.map((data) => (
                                                <React.Fragment key={data._id}>
                                                    <ChatMessage
                                                        menuAction={() => onUserEmojiClick(data.sender._id)}
                                                        tsp={timeFromNow(data.createdAt)}
                                                        imgSize="3.5"
                                                        emoji={data.sender.mood}
                                                        text={data.msg}
                                                        type={
                                                            userProfile._id === data.sender._id
                                                                ? "user"
                                                                : ""
                                                        }
                                                        user={data.sender.name}
                                                    />
                                                </React.Fragment>
                                            ))}
                                        </>
                                    )}
                        </ChatFloating>
                    )}
                    {mobile && pannel.chat && (
                        <div className="dashboard-chat__m">
                            <div className="dashboard-chat__m--head">
                                <IconBtn onClick={() => setPannel("chat", false)}>
                                    <Cross />
                                </IconBtn>
                                <span className="dashboard-chat__m--head--txt">
                                    {allUsers.length} user{allUsers.length > 1 ? "s" : ""} in{" "}
                                    {truncate(user.spot, { length: 31 })}
                                </span>
                            </div>
                            <ChatMobile
                                onSubmit={onSend}
                                onChange={({ target: { value } }) => setMessage(value)}
                                value={message}
                            >
                                {statusA === "loading" ? (
                                    <div className="dashboard-chat__loading">
                                        <Loader />
                                    </div>
                                ) : statusA === "error" ? (
                                    <div>error</div>
                                ) : (
                                            <>
                                                {sorted.map((data) => (
                                                    <ChatMessage
                                                        menuAction={() => onUserEmojiClick(data.sender.id)}
                                                        tsp={timeFromNow(data.createdAt)}
                                                        imgSize="4"
                                                        key={data._id}
                                                        emoji={data.sender.mood}
                                                        text={data.msg}
                                                        type={
                                                            userProfile._id === data.sender._id
                                                                ? "user"
                                                                : "sender"
                                                        }
                                                        user={data.sender.name}
                                                    />
                                                ))}
                                            </>
                                        )}
                            </ChatMobile>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default DashboardChat;
