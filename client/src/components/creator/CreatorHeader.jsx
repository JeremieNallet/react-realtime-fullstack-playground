import "./_CreatorHeader.scss";
import { Link } from "react-router-dom";
import React from "react";

//folders
import { Cross } from "../../assets/svgs/icons";
import useResponsive from "../../hooks/useResponsive";

const CreatorHeader = ({ children, title }) => {
    const { isMobileScreen } = useResponsive();
    return (
        <header className={`creator-header ${isMobileScreen ? "m" : ""}`}>
            <Link to="/" className="creator-header__cancel-btn">
                <Cross />
            </Link>
            <div className="creator-header__steps">
                {title} <span>steps {children}</span>
            </div>
        </header>
    );
};

export default CreatorHeader;
