import "./_GroupNav.scss";
import React from "react";
import { NavLink } from "react-router-dom";

// -> foder
import { Home, Chat, Users } from "../../assets/svgs/icons";

const GroupNav = ({ slug }) => {
    const NavLinks = [
        {
            title: "About",
            icon: <Home />,
            exact: true,
            activeClassName: "active",
            path: `/group/${slug}`,
        },

        {
            title: "Live chat",
            icon: <Chat />,
            exact: true,
            activeClassName: "active",
            path: `/group/${slug}/chat`,
        },
        {
            title: "Members",
            icon: <Users />,
            exact: false,
            activeClassName: "active",
            path: `/group/${slug}/members`,
        },
    ];

    return (
        <nav className="group-nav">
            <div className="container">
                {NavLinks.map(({ exact, icon, title, path }, i) => (
                    <NavLink
                        key={i}
                        exact={exact}
                        to={path}
                        activeClassName="active"
                        className="group-nav__links"
                    >
                        <span className="group-nav__links--name">{title}</span>
                        <div className="group-nav__links--icon">{icon}</div>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default GroupNav;
