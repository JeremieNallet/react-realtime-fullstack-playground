import "./_DeviceNavBar.scss";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

//fodler
import { MapPin, Users, Chat, Bell } from "../../assets/svgs/icons";
import { getReceivedMessages, getReceivedNotifications } from "../../API";
import { useQuery } from "react-query";
import { messengerSocket, notficationSocket } from "../../utils/sockets";

const DeviceNavBar = () => {
    const { data: dataMessages, refetch: refetchMsg } = useQuery(
        "MESSAGES_COUNT",
        getReceivedMessages
    );
    const { data: dataNotification, refetch: refetchNoti } = useQuery(
        "NOTIFICATIONS_COUNT",
        getReceivedNotifications
    );
    useEffect(() => {
        messengerSocket.on("NOTIFICATIONS_UPDATE", () => refetchMsg());
    }, [refetchMsg]);
    useEffect(() => {
        notficationSocket.on("NOTIFICATIONS_UPDATE", () => refetchNoti());
    }, [refetchNoti]);

    const Links = [
        { icon: <MapPin />, text: "explorer", to: "/", notification: null },
        { icon: <Users />, text: "group", to: "/m/groups", notification: null },
        {
            icon: <Chat />,
            text: "message",
            to: "/pm",
            notification: dataMessages && dataMessages.count,
        },
        {
            icon: <Bell />,
            text: "notification",
            to: "/m/noti",
            notification: dataNotification && dataNotification.count,
        },
    ];
    return (
        <>
            <nav className="nav-bar">
                {Links.map(({ to, icon, text, notification }, i) => (
                    <NavLink
                        exact
                        key={i}
                        className="nav-bar__link"
                        to={to}
                        activeClassName="active"
                    >
                        <div className="nav-bar__link--content">
                            <span className="icon">
                                {icon}
                                {notification > 0 && notification !== null && (
                                    <span className="notification">
                                        <span className="notification--number">{notification}</span>
                                    </span>
                                )}
                            </span>
                            <span className="text">{text}</span>
                        </div>
                    </NavLink>
                ))}
            </nav>
        </>
    );
};

export default DeviceNavBar;
