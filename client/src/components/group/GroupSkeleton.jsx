import "./_GroupSkeleton.scss";
import React from "react";
import { Link } from "react-router-dom";

// -> folder
import { Plus } from "../../assets/svgs/icons";
import { RegularBtn } from "../shared/Buttons";

const GroupSkeleton = ({ creationBtn = false }) => {
    return (
        <div className={`group-skeleton ${creationBtn ? "creation" : ""}`}>
            {creationBtn && (
                <>
                    <div className="group-skeleton__sign">
                        <Link className="group-skeleton__sign--link" to="/create">
                            <Plus />
                        </Link>
                    </div>
                    <div className="group-skeleton__btn">
                        <RegularBtn
                            background="light-grey"
                            color="primary"
                            title="create group"
                            type="arrow-right"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupSkeleton;
