import "./_HeaderLogo.scss";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/svgs/logo.svg";
//folder
import { useStore } from "../../store";

const HeaderLogo = () => {
    const { pathname } = useLocation();
    const pannel = useStore((state) => state.pannel);
    const condition = pannel.side || pathname !== "/";

    return (
        <div className="header-logo">
            {condition && (
                <Link className="header-logo__link" to="/">
                    <img className="header-logo__link--item" src={logo} alt="logo" />
                    <span className="header-logo__link--txt">stumbly.io</span>
                </Link>
            )}
        </div>
    );
};

export default HeaderLogo;
