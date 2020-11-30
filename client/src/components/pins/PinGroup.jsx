import "./_PinGroup.scss";
import React from "react";
import { useStore } from "../../store";

const PinAllGroups = ({ firstLetter }) => {
    const viewPortState = useStore((state) => state.viewPortState);
    const farAwayDistance = useStore((state) => state.farAwayDistance);
    const condition = viewPortState.zoom < farAwayDistance;
    return (
        <>
            <div
                className={`pin-group ${
                    viewPortState.zoom < farAwayDistance ? "far-distance" : ""
                }`}
            >
                <span className="pin-group__letter">{firstLetter}</span>
            </div>
            {!condition && (
                <>
                    <div className="pin-group-halo" />
                    <div className="pin-group-halo-pulse" />
                </>
            )}
        </>
    );
};

export default PinAllGroups;
