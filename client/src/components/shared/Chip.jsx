import "./_Chip.scss";
import React from "react";

const Chip = ({ children }) => {
    return (
        <div className="chip">
            <span className="chip--text">{children}</span>
        </div>
    );
};

export default Chip;
