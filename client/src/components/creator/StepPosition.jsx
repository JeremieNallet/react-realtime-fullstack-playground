import "./_StepPosition.scss";
import React, { useEffect } from "react";
import { Marker } from "react-map-gl";
import { isMobile } from "react-device-detect";
// => folder
import { useStore } from "../../store";
import { getUserPosition, getUserIpInfo } from "../../API";
import { reversedGeoCoding } from "../../utils/reverseGeoCoding";
import Map from "../shared/Map";
import InputMapSearch from "../Input/InputMapSearch";
import CreatorControls from "./CreatorControls";
import CreatorLayout from "./CreatorLayout";
import { useQuery } from "react-query";

import PinGroup from "../pins/PinGroup";
import useResponsive from "../../hooks/useResponsive";

const StepPosition = ({ position, setSteps, steps, setGroupRoom, info }) => {
    const [groupPosition, setGroupPosition] = position;
    const [groupInfo, setGroupInfo] = info;
    const viewPortState = useStore((state) => state.viewPortState);
    const setNextViewport = useStore((state) => state.setNextViewport);
    const updateViewport = useStore((state) => state.updateViewport);

    const { data: userPosition } = useQuery("GET_USER_POSITION", getUserPosition);
    const { data: userIpinfo } = useQuery("GET_USER_IP_INFO", getUserIpInfo);

    const onSelectFromMap = async (e) => {
        const [long, lat] = e.lngLat;
        const { location, spot } = await reversedGeoCoding(long, lat);
        setGroupInfo({ ...groupInfo, address: location });
        setGroupPosition({ long, lat });
        setGroupRoom(spot);
    };

    useEffect(() => {
        if (userPosition) {
            const [long, lat] = userPosition.location.coordinates;
            updateViewport({ latitude: lat, longitude: long, zoom: 15.5 });
            (async () => {
                const { spot } = await reversedGeoCoding(long, lat);
                setGroupRoom(spot);
            })();
        } else if (userIpinfo) {
            const { latitude, longitude } = userIpinfo;
            updateViewport({ latitude, longitude, zoom: 15.5 });
            (async () => {
                const { spot } = await reversedGeoCoding(longitude, latitude);
                setGroupRoom(spot);
            })();
        }
    }, [updateViewport, setGroupRoom, userIpinfo, userPosition]);

    const __GroupPosition = () => (
        <>
            {groupPosition && (
                <Marker longitude={groupPosition.long} latitude={groupPosition.lat}>
                    <PinGroup firstLetter={groupInfo.title.charAt(0).toUpperCase()} />
                </Marker>
            )}
        </>
    );
    const { isMobileScreen } = useResponsive();

    return (
        <CreatorLayout
            controls={
                <CreatorControls
                    cancelBtn
                    prevPath="/create"
                    enabled={groupPosition}
                    setSteps={setSteps}
                    steps={steps}
                    nextPath="/create/description"
                />
            }
            title="Choose a location"
            steps={`${steps.current} on ${steps.total}`}
        >
            <div className={`creator-position ${isMobileScreen ? "m" : ""}`}>
                <div className="creator-position__map">
                    <div className="creator-position__map--input">
                        <InputMapSearch background="white" />
                    </div>
                    <div className="creator-position__map--map">
                        <Map
                            onClick={onSelectFromMap}
                            viewport={viewPortState}
                            onViewportChange={(nextViewport) => setNextViewport(nextViewport)}
                            width="100vw"
                            height="100%"
                            cursor="crosshair"
                            className="creator-position__map--map"
                        >
                            {__GroupPosition()}
                            {!groupPosition && (
                                <span
                                    style={{ bottom: `${isMobile ? "23rem" : "21rem"}` }}
                                    className="add-indicator"
                                >
                                    {isMobile ? "touch" : "click"} to place group position.
                                </span>
                            )}
                        </Map>
                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
};

export default StepPosition;
