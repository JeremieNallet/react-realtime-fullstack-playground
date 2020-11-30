import "./_MobileLayout.scss";
import React from "react";
import { useLocation } from "react-router-dom";
import DeviceHead from "./DeviceHead";
import DeviceNavBar from "./DeviceNavBar";
import { useStore } from "../../store";

const MobileLayout = ({ children }) => {
    const { pathname } = useLocation();
    const pannel = useStore((state) => state.pannel);

    return (
        <div className="device-view">
            {!pathname.startsWith("/create") && (
                <div className="device-view__head">
                    <DeviceHead />
                </div>
            )}
            <div className="device-view__content">{children}</div>

            {!pannel.chat && !pannel.search && (
                <>
                    {!pathname.startsWith("/create") && (
                        <div className="device-view__nav">
                            <DeviceNavBar />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MobileLayout;
