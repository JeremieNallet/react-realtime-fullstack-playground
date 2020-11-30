import "./_PinDot.scss";
import React from "react";
import { useStore } from "../../store";

const PinDot = ({ emoji }) => {
    const viewPortState = useStore((state) => state.viewPortState);
    const farAwayDistance = useStore((state) => state.farAwayDistance);
    const condition = viewPortState.zoom < farAwayDistance;
    return (
        <>
            <div className={`pin-dot ${condition ? "far-distance" : ""}`}>
                <img src={emoji} alt="user" />
            </div>
            {!condition && (
                <>
                    <div className="pin-dot-halo" />
                    <div className="pin-dot-halo-pulse" />
                </>
            )}
        </>
    );
};

export default PinDot;
