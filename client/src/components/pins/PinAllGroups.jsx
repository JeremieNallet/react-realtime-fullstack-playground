import "./_PinAllGroups.scss";
import React from "react";
import { useStore } from "../../store";

//folder

const PinAllGroups = ({ title, onClick }) => {
    const firstGroupLetter = title.charAt(0).toUpperCase();
    const viewPortState = useStore((state) => state.viewPortState);
    const farAwayDistance = useStore((state) => state.farAwayDistance);
    return (
        <div
            onClick={onClick}
            className={`pin-all-groups ${
                viewPortState.zoom < farAwayDistance ? "far-distance" : ""
            }`}
        >
            <span className="pin-all-groups__letter">{firstGroupLetter}</span>
        </div>
    );
};

export default PinAllGroups;
