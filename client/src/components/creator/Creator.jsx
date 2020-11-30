import "./_Creator.scss";
import React, { useState, useEffect } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";

// => fodler
import StepIntro from "./StepIntro";
import StepPosition from "./StepPosition";
import StepValidate from "./StepValidate";
import StepDescription from "./StepDescription";
import { useStore } from "../../store";

const Creator = () => {
    const [groupPosition, setGroupPosition] = useState(null);
    const [groupDestination] = useState(null);
    const [steps, setSteps] = useState({
        total: 4,
        current: 1,
        error: false,
    });
    const [groupInfo, setGroupInfo] = useState({
        title: "",
        description: "",
        address: "",
        img: null,
    });
    const [groupRoom, setGroupRoom] = useState(null);
    const [progressBar, setProgressBar] = useState("");

    const onGoingGroupCreation = useStore((state) => state.onGoingGroupCreation);
    const user = useStore((state) => state.user);
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const currentPage = pathname.split("/")[2];
    useEffect(() => {
        if (!onGoingGroupCreation || user.hasGroup) replace("/");
    }, [onGoingGroupCreation, replace, user.hasGroup]);

    useEffect(() => {
        if (!currentPage) {
            setProgressBar("-75%");
        } else if (currentPage === "position") {
            setProgressBar("-50%");
        } else if (currentPage === "description") {
            setProgressBar("-25%");
        } else if (currentPage === "validate") {
            setProgressBar("-0%");
        }
    }, [currentPage]);

    return (
        <div className="creator">
            <div className="creator__progress">
                <div
                    style={{ transform: `translateX(${progressBar})` }}
                    className="creator__progress--item"
                />
            </div>

            <Switch>
                <Route
                    exact
                    path="/create"
                    render={() => (
                        <StepIntro
                            setSteps={setSteps}
                            steps={steps}
                            info={[groupInfo, setGroupInfo]}
                        />
                    )}
                />
                <Route
                    path="/create/position"
                    render={() => (
                        <StepPosition
                            steps={steps}
                            setSteps={setSteps}
                            setGroupRoom={setGroupRoom}
                            position={[groupPosition, setGroupPosition]}
                            info={[groupInfo, setGroupInfo]}
                        />
                    )}
                />
                <Route
                    path="/create/description"
                    render={() => (
                        <StepDescription
                            steps={steps}
                            setSteps={setSteps}
                            info={[groupInfo, setGroupInfo]}
                        />
                    )}
                />
                <Route
                    path="/create/validate"
                    render={() => (
                        <StepValidate
                            steps={steps}
                            setSteps={setSteps}
                            groupRoom={groupRoom}
                            data={[groupInfo, groupPosition, groupDestination]}
                        />
                    )}
                />
            </Switch>
        </div>
    );
};

export default Creator;
