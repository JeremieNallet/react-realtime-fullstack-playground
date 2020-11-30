import "./_DashboardGroup.scss";
import React from "react";
import CardGroupList from "../card/CardGroupList";
import { useStore } from "../../store";

const DashboardGroup = ({ groupInfo }) => {
    const setPannel = useStore((state) => state.setPannel);

    return (
        <div className="d-group">
            <CardGroupList
                noHover
                onClose={() => setPannel("groupInfo", false)}
                {...groupInfo}
                width="35rem"
            />
        </div>
    );
};

export default DashboardGroup;
