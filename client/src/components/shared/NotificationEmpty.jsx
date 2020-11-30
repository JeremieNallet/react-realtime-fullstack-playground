import "./_NotificationEmpty.scss";
import React from "react";

//folder
import useResponsive from "../../hooks/useResponsive";

const NotificationEmpty = ({ text }) => {
    const { isMobileScreen } = useResponsive();
    return (
        <div className={`notification-empty ${isMobileScreen ? "m" : ""}`}>
            <span className="notification-empty__txt">{text}</span>
        </div>
    );
};

export default NotificationEmpty;
