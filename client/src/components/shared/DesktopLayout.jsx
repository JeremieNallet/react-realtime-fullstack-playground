import React from "react";
import "./_DesktopLayout.scss";
import { useLocation } from "react-router";
import Header from "../header/Header";

const DesktopLayout = ({ children }) => {
    const location = useLocation();
    const renderHeader = () => {
        if (location.pathname.startsWith("/create")) return null;
        else return <Header />;
    };

    return (
        <div className="desktop-layout">
            {renderHeader()}
            {children}
        </div>
    );
};

export default DesktopLayout;
