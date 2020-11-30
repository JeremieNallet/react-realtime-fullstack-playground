import "./_CreatorLayout.scss";
import React from "react";

//folder
import CreatorHeader from "./CreatorHeader";
import useResponsive from "../../hooks/useResponsive";

const CreatorLayout = ({ steps, title, children, controls }) => {
    const { isMobileScreen } = useResponsive();
    return (
        <div className={`creator-layout ${isMobileScreen ? "m" : ""}`}>
            <div className="creator-layout__header">
                <CreatorHeader title={title}>{steps}</CreatorHeader>
            </div>
            <div className="creator-layout__content">{children}</div>
            <div className="creator-layout__controls">{controls}</div>
        </div>
    );
};

export default CreatorLayout;
