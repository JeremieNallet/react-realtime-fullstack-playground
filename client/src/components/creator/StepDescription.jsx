import "./_CreatorDescription.scss";
import React from "react";

//fodler
import CreatorLayout from "./CreatorLayout";
import CreatorControls from "./CreatorControls";

const StepDescription = ({ info, steps, setSteps }) => {
    const [groupInfo, setGroupInfo] = info;

    return (
        <CreatorLayout
            controls={
                <CreatorControls
                    cancelBtn
                    enabled
                    setSteps={setSteps}
                    steps={steps}
                    nextPath="/create/validate"
                    prevPath="/create/position"
                />
            }
            title="Describe your group (optional)"
            steps={`${steps.current} on ${steps.total}`}
        >
            <div className="creator-description">
                <textarea
                    className="textarea"
                    placeholder="Description ..."
                    maxLength="720"
                    onChange={({ target: { value } }) =>
                        setGroupInfo({ ...groupInfo, description: value })
                    }
                    value={groupInfo.description}
                />
                <small className="creator-description__max-char">
                    maximum {720 - groupInfo.description.length} characters
                </small>
            </div>
        </CreatorLayout>
    );
};

export default StepDescription;
