import "./_Loader.scss";
import React from "react";

export const Loader = ({ size = 5 }) => {
    const borderSize = () => {
        if (size >= 10) {
            return `1.${size}rem`;
        } else {
            return `0.${size}rem`;
        }
    };
    return (
        <div
            style={{
                width: `${size}rem`,
                height: `${size}rem`,
                border: `${borderSize()} solid #b1bcd660`,
                borderRight: `${borderSize()} solid var(--color-theme-1)`,
            }}
            className="spinner"
        ></div>
    );
};

export default Loader;
