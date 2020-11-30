import "./_Messenger.scss";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useSpring, animated as a } from "react-spring";

//folder
import MessengerChat from "./MessengerChat";
import MessengerDiscussions from "./MessengerDiscussions";
import useResponsive from "../../hooks/useResponsive";
import messenger from "../../assets/svgs/img/messenger.svg";

const Messenger = () => {
    const location = useLocation();
    const { isMobileScreen } = useResponsive();
    const slideStyle = useSpring({
        transform: `translate3d(${
            location.pathname.split("/")[2] && isMobileScreen ? "-50%" : "0%"
        }, 0, 0)`,
        config: { mass: 0.01, tension: 65, friction: 5.5, precision: 0.0001, clamp: true },
    });

    return (
        <a.div style={slideStyle} className={`messenger ${isMobileScreen ? "m" : ""}`}>
            <MessengerDiscussions />
            <div className="messenger__content">
                <Switch>
                    <Route exact path="/pm/:receiverID" render={() => <MessengerChat />} />
                    <Route
                        path="/pm"
                        render={() => (
                            <div className="messenger__preview">
                                {!isMobileScreen && (
                                    <div className="container">
                                        <img src={messenger} alt="illustration" />
                                    </div>
                                )}
                            </div>
                        )}
                    />
                </Switch>
            </div>
        </a.div>
    );
};

export default Messenger;
