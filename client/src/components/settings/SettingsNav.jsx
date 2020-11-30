import "./_SettingsNav.scss";
import React from "react";
import { NavLink } from "react-router-dom";

// => folder
import { ChevronRight } from "../../assets/svgs/icons";

const SettingsNav = () => {
    return (
        <nav className="settings-nav">
            <NavLink exact activeClassName="active" className="settings-nav__link" to="/settings">
                <span className="settings-nav__link--name">Account settings</span>
                <ChevronRight className="settings-nav__link--arrow" />
            </NavLink>
            <NavLink
                activeClassName="active"
                className="settings-nav__link"
                to="/settings/security">
                <span className="settings-nav__link--name">Security settings</span>
                <ChevronRight className="settings-nav__link--arrow" />
            </NavLink>
        </nav>
    );
};

export default SettingsNav;
