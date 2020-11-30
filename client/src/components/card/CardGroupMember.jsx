import "./_CardGroupMember.scss";
import React from "react";

// -> folder
import UserImg from "../shared/UserImg";
import useResponsive from "../../hooks/useResponsive";
import { truncate } from "lodash";

const CardGroupMember = ({ img, status, name, tsp }) => {
    const { isMobileScreen } = useResponsive();
    return (
        <div className="c-group-member">
            <div className="c-group-member__top">
                <div className="img">
                    <UserImg size={6} name={name} img={img} alt="img" />
                </div>

                <div>
                    <span className="name">
                        {truncate(name, { length: `${isMobileScreen ? 30 : 36}` })}
                    </span>
                    <p className="joinned">{tsp}</p>
                </div>
            </div>
            <div className="c-group-member__bot">{status}</div>
        </div>
    );
};

export default CardGroupMember;
