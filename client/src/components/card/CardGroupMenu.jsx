import "./_CardGroupMenu.scss";
import React from "react";

// -> folders
import { Users, Home, Plus } from "../../assets/svgs/icons";
import { truncate } from "lodash";

const CardGroupMenu = ({
    onClick,
    img,
    create = false,
    member = false,
    admin = false,
    title = "Create a group",
}) => {
    const Icon = create ? Plus : member ? Users : Home;

    return (
        <div onClick={onClick} className={`c-group-menu ${!img ? "adding" : ""}`}>
            {img ? (
                <>
                    <div className="c-group-menu__left">
                        <img className="c-group-menu__img" src={img} alt="group-img" />
                        <span className="c-group-menu__title">
                            {truncate(title, { length: 30 })}
                        </span>
                    </div>
                    {admin && (
                        <div className="c-group-menu__right">
                            <Icon />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="c-group-menu__adding">
                        <button className="c-group-menu__adding--btn">
                            <Icon />
                        </button>
                        <span className="c-group-menu__title">create a new group</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardGroupMenu;
