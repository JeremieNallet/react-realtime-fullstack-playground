import "./_PinAllUsers.scss";
import React from "react";
import { useStore } from "../../store";
const PinAllUsers = ({ mood, onClick }) => {
    const viewPortState = useStore((state) => state.viewPortState);
    const farAwayDistance = useStore((state) => state.farAwayDistance);
    return (
        <div
            onClick={onClick}
            className={`pin-all-users ${
                viewPortState.zoom < farAwayDistance ? "far-distance" : ""
            }`}
        >
            <img className="pin-all-users__img" src={mood} alt="user" />
        </div>
    );
};

export default PinAllUsers;
