import "./_BigLoader.scss";
import React from "react";

//folder
import Loader from "./Loader";

const BigLoader = () => {
    return (
        <div className="big-loader">
            <Loader size="8" />
        </div>
    );
};

export default BigLoader;
