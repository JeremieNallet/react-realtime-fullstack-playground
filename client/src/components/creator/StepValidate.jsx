import "./_StepValidate.scss";
import React from "react";
import { useHistory } from "react-router-dom";
import { axios } from "../../API";

// => folder
import { useStore } from "../../store";
import CreatorControls from "./CreatorControls";
import CreatorLayout from "./CreatorLayout";
import CardGroupCreation from "../card/CardGroupCreation";
import Map from "../shared/Map";

const StepValidate = ({ data, steps, setSteps, groupRoom }) => {
    const history = useHistory();
    const [groupInfo, groupPosition] = data;
    const setGroup = useStore((state) => state.setGroup);
    const viewPortState = useStore((state) => state.viewPortState);
    const setNextViewport = useStore((state) => state.setNextViewport);

    const createGroup = async () => {
        const { long, lat } = groupPosition;
        const groupData = {
            location: { coordinates: [long, lat] },
            title: groupInfo.title,
            description: groupInfo.description,
            address: groupInfo.address,
            img: groupInfo.img,
            room: groupRoom,
        };

        setGroup("position", { long, lat });

        try {
            const { status, data } = await axios.post("/groups", groupData);
            if (status === 200) {
                history.push(`/group/${data.slug}`);
            }
        } catch ({ response }) {
            console.error(response.data);
        }
    };

    return (
        <CreatorLayout
            controls={
                <CreatorControls
                    enabled
                    setSteps={setSteps}
                    steps={steps}
                    displayPrev={false}
                    nextTitle="create"
                    prevPath="/create/description"
                    validate
                    onClick={createGroup}
                />
            }
            title="You are all set !"
            steps={`${steps.current} on ${steps.total}`}
        >
            <div className="step-validate">
                <div className="step-validate__map">
                    <Map
                        viewport={viewPortState}
                        onViewportChange={(nextViewport) => setNextViewport(nextViewport)}
                        scrollZoom={false}
                        width="100vw"
                        height="100%"
                        cursor="crosshair"
                    />
                </div>

                <CardGroupCreation
                    description={groupInfo.description}
                    img={groupInfo.img}
                    title={groupInfo.title}
                    spot={groupRoom}
                    address={groupInfo.address}
                />
            </div>
        </CreatorLayout>
    );
};

export default StepValidate;
