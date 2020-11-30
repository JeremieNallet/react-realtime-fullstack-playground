import "./_ServerError.scss";
import React from "react";
import { animated as a, useSpring } from "react-spring";
import { useStore } from "../../store";

import { Cross } from "../../assets/svgs/icons";

const ServerError = () => {
    const serverError = useStore((state) => state.serverError);
    const setServerError = useStore((state) => state.setServerError);
    const animateError = useSpring({
        transform: `translate3d(0, ${serverError ? "0%" : "-103%"}, 0)`,
        config: { mass: 0.1, tension: 50, friction: 5 },
    });
    return (
        <a.div style={animateError} className="server-error">
            <div className="containerss">
                <span className="server-error__message">{serverError}</span>
                <button
                    onClick={() => setServerError(null)}
                    className="server-error__close"
                >
                    <Cross />
                </button>
            </div>
        </a.div>
    );
};

export default ServerError;
