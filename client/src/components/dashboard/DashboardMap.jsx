import "./_DashboardMap.scss";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Marker } from "react-map-gl";
import { useSpring, animated as a } from "react-spring";

//folder
import {
    getUserPosition,
    getUserIpInfo,
    getUserProfile,
    getUserGroup,
    getUsersWithin,
    getAllGroupsWithin,
} from "../../API";
import { reversedGeoCoding } from "../../utils/reverseGeoCoding";

import { useStore } from "../../store";
import DashboardChat from "./DashboardChat";
import DashboardControls from "./DashboardControls";
import DashboardEmojiPannel from "./DashboardEmojiPannel";
import DashboardSearch from "./DashboardSearch";
import DashboardUser from "./DashboardUser";
import { lobbySocket } from "../../utils/sockets";
import Map from "../shared/Map";
import PinAllGroups from "../pins/PinAllGroups";
import PinAllUsers from "../pins/PinAllUsers";
import PinGroup from "../pins/PinGroup";
import PinDot from "../pins/PinDot";
import useResponsive from "../../hooks/useResponsive";
import DashboardGroup from "./DashboardGroup";
import Loader from "../shared/Loader";

const cursorTranslate = (x, y) => `translate3d(${x}px, ${y}px, 0) translate3d(-50%,-50%,0)`;

const DashMap = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);
    const viewPortState = useStore((state) => state.viewPortState);
    const updateViewport = useStore((state) => state.updateViewport);
    const setGroup = useStore((state) => state.setGroup);
    const group = useStore((state) => state.group);
    const setPannel = useStore((state) => state.setPannel);
    const pannel = useStore((state) => state.pannel);
    const mapLoaded = useStore((state) => state.mapLoaded);
    const [currentUser, setCurrentUser] = useState({ _id: null, emoji: null });
    const [groupInfo, setGroupInfo] = useState({});
    const { isMobileScreen } = useResponsive();
    const { data: userIpinfo } = useQuery("GET_USER_IP_INFO", getUserIpInfo);
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);

    const [{ xy }, setMouseCoord] = useSpring(() => ({
        xy: [0, 0],
        display: "none",
        config: { mass: 0.1, tension: 50, friction: 3.5, clamp: true },
    }));

    useEffect(() => {
        if (user.isAddingPosition && !isMobileScreen) {
            const mouseMoveHandler = ({ clientX: x, clientY: y }) => {
                setMouseCoord({ xy: [x, y] });
            };
            window.addEventListener("mousemove", mouseMoveHandler);
            return () => window.removeEventListener("mousemove", mouseMoveHandler);
        }
    }, [isMobileScreen, setMouseCoord, user.isAddingPosition]);

    const { data: userPosition } = useQuery("GET_USER_POSITION", getUserPosition, {
        onSuccess: (data) => {
            if (data) {
                const [long, lat] = data.location.coordinates;
                setUser("spot", data.room);
                setUser("position", { long, lat });
                setUser("emoji", data.mood);
            }
        },
    });

    useQuery("GET_USER_GROUP", getUserGroup, {
        onSuccess: (data) => {
            if (data) {
                const [long, lat] = data.location.coordinates;
                setGroup("title", data.title);
                setGroup("position", { long, lat });
            }
        },
    });

    useQuery(["GET_USERS_WITHIN", user.spot], getUsersWithin, {
        onSuccess: (data) => {
            setAllUsers(data.data);
        },
    });

    useQuery(
        user.position && [
            "GET_ALLL_GROUPS_WITHIN",
            user.spot,
            user.distance,
            `${user.position.lat},${user.position.long}`,
        ],
        user.position && getAllGroupsWithin,
        user.position && {
            onSuccess: (data) => {
                setAllGroups(data.mapData);
            },
            onError: (data) => {
                console.error(data, "error while fetching gorups");
            },
        }
    );



    const onClickAddUserPosition = async ({ lngLat: [long, lat] }) => {
        lobbySocket.open();
        setUser("isAddingPosition", false);
        if (user.isAddingPosition && userProfile) {
            const { spot } = await reversedGeoCoding(long, lat);
            setUser("position", { long, lat });
            setUser("spot", spot);
            if (!isMobileScreen) setPannel("chat", true);
            const socketObject = {
                userId: userProfile._id,
                coords: [long, lat],
                spot,
                emoji: user.emoji,
                name: userProfile.name,
                createPosition: true,
            };

            lobbySocket.emit("LOBBY_JOIN", socketObject);
        }
    };
    useEffect(() => {
        if (userPosition) {
            lobbySocket.connect();
            const { location, room, user } = userPosition;
            const [long, lat] = location.coordinates;
            setUser("spot", room);
            const socketObject = {
                userId: user._id,
                coords: [long, lat],
                spot: room,
                mood: user.emoji,
                name: user.name,
            };
            lobbySocket.emit("LOBBY_JOIN", socketObject);
        }
    }, [setUser, userPosition]);

    useEffect(() => {
        return () => {
            lobbySocket.disconnect();
            lobbySocket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        lobbySocket.on("LOBBY_GROUP_ADDED", ({ position }) => {
            setAllGroups((prev) => [...prev, position]);
        });
    }, []);

    useEffect(() => {
        lobbySocket.on("LOBBY_GROUP_DELETED", ({ docId }) => {
            setAllGroups(allGroups.filter((el) => el._id !== docId));
        });
    }, [allGroups]);

    useEffect(() => {
        lobbySocket.on("LOBBY_POSITION_DELETED", ({ docId }) => {
            setAllUsers(allUsers.filter((el) => el._id !== docId));
        });
    }, [allUsers]);

    useEffect(() => {
        lobbySocket.on("LOBBY_POSITION_ADDED", ({ position }) => {
            setAllUsers((prev) => [...prev, position]);
        });
    }, []);

    useEffect(() => {
        if (user.position) {
            const { long, lat } = user.position;
            updateViewport({ latitude: lat, longitude: long, zoom: 16.5 });
        } else if (group.position) {
            const { long, lat } = group.position;
            updateViewport({ latitude: lat, longitude: long, zoom: 16.5 });
        } else if (userIpinfo) {
            const { latitude, longitude } = userIpinfo;
            updateViewport({ latitude, longitude });
        }
    }, [group.position, updateViewport, user.position, userIpinfo]);

    const UserPosition = () => (
        <Marker className="user-index" longitude={user.position.long} latitude={user.position.lat}>
            <PinDot emoji={user.emoji} />
        </Marker>
    );

    const GroupPosition = () => (
        <Marker
            className="user-group-index"
            longitude={group.position.long}
            latitude={group.position.lat}
        >
            <PinGroup firstLetter={group.title.charAt(0).toUpperCase()} />
        </Marker>
    );

    const AllPositions = () => (
        <>
            {allUsers.map((position) => {
                const [long, lat] = position.location.coordinates;
                return (
                    <Marker
                        className="users-index"
                        key={position._id}
                        longitude={long}
                        latitude={lat}
                    >
                        <PinAllUsers
                            {...position}
                            onClick={() => {
                                updateViewport({ latitude: lat, longitude: long, zoom: 17 });
                                setPannel("userInfo", true);
                                setCurrentUser({ _id: position.user._id, emoji: position.mood });
                            }}
                        />
                    </Marker>
                );
            })}
        </>
    );

    const AllGroups = () => (
        <>
            {allGroups.map((group) => {
                const [long, lat] = group.location.coordinates;
                return (
                    <Marker key={group._id} longitude={long} latitude={lat}>
                        <PinAllGroups
                            {...group}
                            onClick={() => {
                                updateViewport({ latitude: lat, longitude: long, zoom: 17 });
                                setPannel("groupInfo", true);
                                setGroupInfo({ ...group });
                            }}
                        />
                    </Marker>
                );
            })}
        </>
    );

    const CursorEmoji = () => (
        <a.img
            src={user.emoji}
            style={{
                display: `${user.isAddingPosition ? "flex" : "none"}`,
                transform: xy.interpolate(cursorTranslate),
            }}
            className="cursor-emoji"
        />
    );

    const IndicationForMobile = () => (
        <div className="mobile-indicator">
            <span className="mobile-indicator__text">Click anywhere to mark your position</span>
        </div>
    );

    return (
        <div className={`dashboard-map ${isMobileScreen ? "m" : ""}`}>
            {!mapLoaded && (
                <div className="dashboard-map__loading">
                    <Loader size="8"></Loader>
                </div>
            )}

            <>
                <DashboardControls allUsers={allUsers} />
                <DashboardEmojiPannel />
                <DashboardChat allUsers={allUsers} mobile={isMobileScreen} />
                {pannel.search && <DashboardSearch />}
                {pannel.groupInfo && <DashboardGroup groupInfo={groupInfo} />}
                {pannel.userInfo && <DashboardUser currentUser={currentUser} />}
                <Map
                    cursor={user.isAddingPosition ? "crosshair" : "grab"}
                    width="100%"
                    height="100%"
                    onClick={onClickAddUserPosition}
                    viewport={viewPortState}
                >
                    {user.position && UserPosition()}
                    {allUsers && user.position && AllPositions()}
                    {allGroups && user.position && AllGroups()}
                    {group.position && group.title && GroupPosition()}
                    {!isMobileScreen && CursorEmoji()}
                    {user.isAddingPosition && isMobileScreen && IndicationForMobile()}
                </Map>
            </>
        </div>
    );
};

export default DashMap;
