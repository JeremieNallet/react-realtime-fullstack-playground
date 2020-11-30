import "./_Dashboard.scss";
import React from "react";

// => folders
import DashboardMap from "./DashboardMap";
import GroupList from "../group/GroupList";
import useResponsive from "../../hooks/useResponsive";
import DashboardGroupMobile from "./DashboardGroupMobile";

const Dashboard = () => {
    const { isMobileScreen } = useResponsive();

    return (
        <>
            {!isMobileScreen ? (
                <div className="dashboard">
                    <GroupList />
                    <DashboardMap />
                </div>
            ) : (
                <>
                    <DashboardMap />
                    <DashboardGroupMobile />
                </>
            )}
        </>
    );
};

export default Dashboard;
