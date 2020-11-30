import "./_EmptyText.scss";
import React from "react";

const EmptyText = ({ text, action, size = "1.6" }) => {
    return (
        <>
            <span
                onClick={action}
                style={{ fontSize: `${size}rem` }}
                className={`empty-text ${action ? "action" : ""}`}>
                {text}
            </span>
        </>
    );
};

export default EmptyText;
