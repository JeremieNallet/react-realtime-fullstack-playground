import "./_MenuLayout.scss";
import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { truncate } from "lodash";

const MenuLayout = ({ children, title, style }) => {
    const { isMobileScreen } = useResponsive();

    return (
        <div style={style} className={`dropdown-layout ${isMobileScreen ? "m" : ""}`}>
            <div className="dropdown-layout__head">
                <span className="dropdown-layout__head--title">
                    {truncate(title, { length: 35 })}
                </span>
            </div>
            <div className="dropdown-layout__content">{children}</div>
        </div>
    );
};

export default MenuLayout;
