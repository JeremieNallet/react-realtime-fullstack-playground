import "./_CardGroupList.scss";
import React from "react";

// -> folders
import { IconBtn, RegularBtn } from "../shared/Buttons";
import { Cross } from "../../assets/svgs/icons";
import { useHistory } from "react-router";
import { getUserProfile } from "../../API";
import { useQuery } from "react-query";

const CardGroupList = ({
    img,
    title,
    width = "100%",
    onClose = false,
    slug,
    totalMembers,
    createdBy,
    locateGroup,
    noHover = false,
}) => {
    const { push } = useHistory();
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);

    const pushToGroupPage = (e) => {
        push(`/group/${slug}`);
        e.stopPropagation();
    };
    return (
        <div
            onClick={locateGroup}
            style={{ width: width }}
            className={`c-group-list ${noHover ? "no-hover" : ""}`}
        >
            {onClose && (
                <IconBtn onClick={onClose} className="c-group-list__close">
                    <Cross />
                </IconBtn>
            )}

            <div className="c-group-list__top">
                <div className="c-group-list__top--img-container">
                    <img
                        className="c-group-list__top--img-container__img"
                        src={img}
                        alt="group-img"
                    />
                </div>
                <div className="c-group-list__top--text-container">
                    <h4 className="c-group-list__top--text-container__title">{title}</h4>
                    <span className="c-group-list__top--text-container__members">
                        {totalMembers} member{totalMembers > 1 ? "s" : ""}
                    </span>
                </div>
            </div>
            <div className="c-group-list__bot">
                <RegularBtn onClick={pushToGroupPage} title="Group page" color="theme-4" arrowRight>
                    Group page
                </RegularBtn>
                {userProfile && userProfile._id === createdBy._id && (
                    <span className="c-group-list__bot--my-group"> my group </span>
                )}
            </div>
        </div>
    );
};

export default CardGroupList;
