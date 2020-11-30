import "./_ServerLost.scss";
import React from "react";
import { RegularBtn } from "../shared/Buttons";
import notFound from "../../assets/svgs/img/404.svg";

const ServerLost = () => {
    const retry = () => {
        window.location.reload();
        window.history.go();
    };
    return (
        <div className="server-lost">
            <div className="img-container">
                <img className="server-lost__img" src={notFound} alt="404" />
            </div>
            <div className="btn-container">
                <span className="server-lost__title">Server connection was lost</span>
                <RegularBtn onClick={retry} arrowRight color="theme-4">
                    try to reconnect
                </RegularBtn>
            </div>
        </div>
    );
};

export default ServerLost;
