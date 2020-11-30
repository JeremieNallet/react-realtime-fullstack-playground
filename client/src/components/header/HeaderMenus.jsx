import "./_HeaderMenus.scss";
import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";

//folder
import { RegularBtn, SquareBtn } from "../shared/Buttons";
import { Bell, Mail } from "../../assets/svgs/icons";
import { useStore } from "../../store";
import { getReceivedMessages, getReceivedNotifications, getUserProfile } from "../../API";
import MenuUser from "../menu/MenuUser";
import MenuNotification from "../menu/MenuNotification";
import MenuMessenger from "../menu/MenuMessenger";
import MenuGroup from "../menu/MenuGroup";
import UserImg from "../shared/UserImg";
import useClickOutside from "use-onclickoutside";
import { messengerSocket, notficationSocket } from "../../utils/sockets";

const HeaderMenus = () => {
    const pannel = useStore((state) => state.pannel);
    const setPannel = useStore((state) => state.setPannel);
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);

    const groupRef = useRef();
    const notificationsRef = useRef();
    const menuRef = useRef();
    const messengerRef = useRef();
    useClickOutside(groupRef, () => setPannel("group", false));
    useClickOutside(notificationsRef, () => setPannel("notifications", false));
    useClickOutside(messengerRef, () => setPannel("messenger", false));
    useClickOutside(menuRef, () => setPannel("menu", false));

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

    return (
        <div className="header-menu">
            <div className="header-menu__item" ref={groupRef}>
                <RegularBtn
                    active={pannel.group}
                    onClick={() => setPannel("group", !pannel.group)}
                    padding="2.5"
                    color="theme-5"
                >
                    groups
                </RegularBtn>
                {pannel.group && <MenuGroup />}
            </div>

            <div className="header-menu__item" ref={messengerRef}>
                <SquareBtn
                    active={pannel.messenger}
                    onClick={() => setPannel("messenger", !pannel.messenger)}
                    icon={<Mail />}
                    notification={dataMessages && dataMessages.count}
                />
                {pannel.messenger && <MenuMessenger />}
            </div>
            <div className="header-menu__item" ref={notificationsRef}>
                <SquareBtn
                    active={pannel.notifications}
                    onClick={() => setPannel("notifications", !pannel.notifications)}
                    icon={<Bell />}
                    notification={dataNotification && dataNotification.count}
                />
                {pannel.notifications && <MenuNotification />}
            </div>
            <div style={{ cursor: "pointer" }} className="header-menu__item" ref={menuRef}>
                <button
                    onClick={() => setPannel("menu", !pannel.menu)}
                    className="header-menu__item--profile"
                >
                    <UserImg
                        pointer
                        size="4.7"
                        name={userProfile && userProfile.name}
                        img={userProfile && userProfile.photo}
                    />
                </button>
                {pannel.menu && <MenuUser />}
            </div>
        </div>
    );
};

export default HeaderMenus;
