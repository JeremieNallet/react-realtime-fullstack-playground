import "./_DeviceHead.scss";
import React, { useState, useEffect } from "react";

import { ChevronLeft } from "../../assets/svgs/icons";

import UserImg from "./UserImg";
import { useLocation, useHistory, NavLink } from "react-router-dom";
import { useQuery } from "react-query";
import { getPublicUser, getUserProfile } from "../../API";
import { useStore } from "../../store";

const DeviceHead = () => {
    const [pageTitle, setPageTitle] = useState("");
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isNav, setIsNav] = useState(null);
    const [groupSlug, setGroupSlug] = useState(null);
    const { push, goBack } = useHistory();
    const { pathname } = useLocation();
    const pannel = useStore((state) => state.pannel);
    const paths = [
        { title: null, current: "/" },
        { title: "settings", current: "/settings" },
        { title: "groups", current: "/m/groups" },
        { title: "messenger", current: "/pm" },
        { title: "notifications", current: "/m/noti" },
    ];

    useQuery(userId && ["GET_PUBLIC_USER", userId], userId && getPublicUser, {
        onSuccess: (data) => setUserName(data.name),
    });

    useEffect(() => {
        paths.forEach((path) => {
            const viewingOneGroup = pathname.split("/")[1] === "group";
            const viewingOneDiscussion = pathname.split("/")[2] !== undefined;
            if (pathname === path.current) {
                setPageTitle(path.title);
            } else if (pathname === "/m/profile") {
                setPageTitle(null);
            }
            if (pageTitle === "messenger" && viewingOneDiscussion) {
                setUserId(pathname.split("/")[2]);
            } else {
                setUserName(null);
                setUserId(null);
            }
            if (pageTitle === "settings") {
                setIsNav("settings-nav");
            } else if (viewingOneGroup) {
                setIsNav("group-nav");
                setGroupSlug(pathname.split("/")[2]);
            } else setIsNav(null);
        });
    }, [pageTitle, pathname, paths]);

    const onBack = () => {
        goBack();
    };

    const SettingsNav = () => (
        <>
            <NavLink
                exact
                activeClassName="active"
                className="device-head__nav--link"
                to="/settings"
            >
                Settings
            </NavLink>
            <NavLink
                exact
                activeClassName="active"
                className="device-head__nav--link"
                to="/settings/security"
            >
                Security
            </NavLink>
        </>
    );

    const GroupNav = () => (
        <>
            {groupSlug && (
                <>
                    <NavLink
                        exact
                        activeClassName="active"
                        className="device-head__nav--link"
                        to={`/group/${groupSlug}`}
                    >
                        About
                    </NavLink>
                    <NavLink
                        exact
                        activeClassName="active"
                        className="device-head__nav--link"
                        to={`/group/${groupSlug}/chat`}
                    >
                        Discussion
                    </NavLink>
                    <NavLink
                        exact
                        activeClassName="active"
                        className="device-head__nav--link"
                        to={`/group/${groupSlug}/members`}
                    >
                        Members
                    </NavLink>
                </>
            )}
        </>
    );

    const conditionalDisplay = !pannel.mobileGroup && !pannel.chat;
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    return (
        <>
            {conditionalDisplay && (
                <div
                    className={`device-head ${pathname.split("/")[1] ? "shadow" : "transparent"} `}
                >
                    <button onClick={onBack} className="device-head__btn">
                        {pathname.split("/")[1] && (
                            <ChevronLeft className="device-head__btn--icon" />
                        )}
                    </button>
                    {isNav ? (
                        <nav className="device-head__nav">
                            {isNav === "settings-nav" ? SettingsNav() : GroupNav()}
                        </nav>
                    ) : (
                        <span className="device-head__title">{userId ? userName : pageTitle}</span>
                    )}

                    <div onClick={() => push("/settings")} className="device-head__profile">
                        {pathname !== "/m/profile" && (
                            <UserImg
                                name={userProfile && userProfile.name}
                                img={userProfile && userProfile.photo}
                                size="4.5"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DeviceHead;
