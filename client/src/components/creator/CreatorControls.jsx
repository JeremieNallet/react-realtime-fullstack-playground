import "./_CreatorControls.scss";
import React from "react";

//folder
import { RegularBtn } from "../shared/Buttons";
import useResponsive from "../../hooks/useResponsive";

const CreatorControls = ({
    prevPath,
    nextPath,
    setSteps,
    steps,
    enabled = false,
    nextTitle = "next step",
    prevTitle = "prev step",
    displayBack = true,
    displayPrev = true,
    onClick,
    validate,
}) => {
    const { isMobileScreen } = useResponsive();
    return (
        <div className={`creator-controls ${isMobileScreen ? "m" : ""}`}>
            <div className="creator-controls--btn-group">
                {displayBack && (
                    <RegularBtn
                        link
                        arrowLeft
                        color="theme-4"
                        title={prevTitle}
                        onClick={() => {
                            setSteps({ ...steps, current: steps.current - 1 });
                        }}
                        className="creator-controls--btn-groups__prev"
                        to={prevPath}
                    >
                        {prevTitle}
                    </RegularBtn>
                )}
                {displayPrev && (
                    <RegularBtn
                        link
                        to={nextPath}
                        arrowRight
                        color="theme-1"
                        disabled={!enabled}
                        onClick={() => {
                            setSteps({ ...steps, current: steps.current + 1 });
                        }}
                    >
                        {nextTitle}
                    </RegularBtn>
                )}
                {validate && (
                    <RegularBtn arrowRight colors="theme-2" onClick={onClick}>
                        validate
                    </RegularBtn>
                )}
            </div>
        </div>
    );
};

export default CreatorControls;
