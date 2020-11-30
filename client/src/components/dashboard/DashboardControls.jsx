import "./_DashboardControls.scss";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { axios } from "../../API";
import { lobbySocket } from "../../utils/sockets";
import localStorage from "local-storage";

//folder
import { RegularBtn, SquareBtn } from "../shared/Buttons";
import { Chat, Plus, Minus, Compas, SearchMagnifier } from "../../assets/svgs/icons";
import { useStore } from "../../store";
import { getLobbyMessages, getUserIpInfo, getUserProfile } from "../../API";
import useResponsive from "../../hooks/useResponsive";

const DashboardControls = ({ allUsers }) => {
    const zoomOut = useStore((state) => state.zoomOut);
    const zoomIn = useStore((state) => state.zoomIn);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const updateViewport = useStore((state) => state.updateViewport);

    const pannel = useStore((state) => state.pannel);
    const setPannel = useStore((state) => state.setPannel);
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    const { data: ipInfo } = useQuery("GET_USER_IP_INFO", getUserIpInfo);
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);

    const _getUserPosition = () => {
        if (user.position) {
            updateViewport({ latitude: user.position.lat, longitude: user.position.long });
        } else {
            const { latitude, longitude } = ipInfo;
            updateViewport({ latitude, longitude });
        }
    };
    const [countMessages, setCountMessages] = useState();

    useQuery(["GET_LOBBY_MESSAGES", user.spot], getLobbyMessages, {
        onSuccess: (data) => setCountMessages(data.count),
        onError: (err) => console.error(err, "couldn't fetch lobby messages."),
    });

    useEffect(() => {
        lobbySocket.on("LOBBY_NEW_MSG", () => setCountMessages((prev) => prev + 1));
    }, []);

    const deletePosition = async () => {
        if (userProfile) {
            setBigLoader(true);
            try {
                const { status } = await axios.delete("/userPosition/deleteMe");
                if (status === 200) {
                    setUser("position", null);
                    setUser("spot", null);
                    setUser("emoji", null);
                    setUser("isUpdatingEmoji", false);
                    setTimeout(() => setBigLoader(false), 1000);
                    lobbySocket.disconnect();
                    lobbySocket.emit("LOBBY_REMOVE_POSITION");
                }
            } catch (err) {
                setTimeout(() => setBigLoader(false), 1000);
                console.log(err);
            }
        }
    };


    const openChatPannel = () => {
        setPannel("chat", true);
        localStorage.set("chat", true);
    };

    const openSidePannel = () => {
        setPannel("side", true);
        localStorage.set("side", true);
    };
    const addPosition = () => {
        setPannel("emojis", true);
        setUser("isUpdatingEmoji", false);
    };

    const openEmojisPannelForUpdate = () => {
        setPannel("emojis", true);
        setUser("isUpdatingEmoji", true);
    };
    const openSearch = () => {
        setPannel("search", true);
    };

    const { isMobileScreen } = useResponsive();

    return (
        <div className={`dashboard-ctrl ${isMobileScreen ? "m" : ""}`}>
            <div className="dashboard-ctrl--position ctrl">
                {(!pannel.side || isMobileScreen) && !user.position && (
                    <SquareBtn
                        onClick={openSearch}
                        icon={<SearchMagnifier iconColor="primary" />}
                    />
                )}

                {!pannel.side && !isMobileScreen && (
                    <RegularBtn
                        className="show-group-list"
                        spacing="2.3"
                        color="theme-5"
                        onClick={openSidePannel}
                        arrowRight
                    >
                        group list
                    </RegularBtn>
                )}
                {!user.isAddingPosition ? (
                    <button
                        className={`share-btn ${user.position ? "remove" : ""}`}
                        onClick={user.position ? deletePosition : addPosition}
                    >
                        {user.position ? "remove position" : "share position"}
                    </button>
                ) : (
                        <button
                            className="share-btn cancel"
                            onClick={() => setUser("isAddingPosition", false)}
                        >
                            cancel
                        </button>
                    )}
                {user.position && (
                    <SquareBtn className="emoji-selector" onClick={openEmojisPannelForUpdate}>
                        <img className="emoji-img" src={user.emoji} alt="emoji" />
                    </SquareBtn>
                )}
            </div>
            <div className={`dashboard-ctrl--map-controls ctrl ${isMobileScreen ? "m" : ""}`}>
                {!isMobileScreen ? (
                    <>
                        <SquareBtn
                            className={`${user.isAddingPosition ? "adding-pos" : ""}`}
                            onClick={_getUserPosition}
                            icon={<Compas />}
                        />
                        <SquareBtn onClick={zoomIn} icon={<Plus />} />
                        <SquareBtn onClick={zoomOut} icon={<Minus />} />
                    </>
                ) : (
                        <>
                            {!pannel.chat && (
                                <SquareBtn
                                    // notification={messages.length}
                                    className={`${user.isAddingPosition ? "adding-pos" : ""}`}
                                    onClick={openChatPannel}
                                    icon={<Chat />}
                                />
                            )}
                            <SquareBtn
                                className={`${user.isAddingPosition ? "adding-pos" : ""}`}
                                onClick={_getUserPosition}
                                icon={<Compas />}
                            />
                        </>
                    )}
            </div>
            {user.position && !isMobileScreen && (
                <div className="dashboard-ctrl--population">
                    {allUsers.length} user{allUsers.length > 1 ? "s" : ""} in {user.spot}
                </div>
            )}

            {!isMobileScreen && (
                <div className="dashboard-ctrl--chat ctrl">
                    {!pannel.chat && (
                        <SquareBtn
                            notification={countMessages >= 99 ? 99 : countMessages}
                            className={`${user.isAddingPosition ? "adding-pos" : ""}`}
                            onClick={openChatPannel}
                            icon={<Chat />}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardControls;
