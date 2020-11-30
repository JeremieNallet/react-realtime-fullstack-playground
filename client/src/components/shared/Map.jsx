import React from "react";
import ReactMapGL from "react-map-gl";
import { useStore } from "../../store";

const Map = ({
    width = "100vw",
    height = "100vh",
    viewport,
    children,
    onClick,
    cursor = "grab",
    scrollZoom = true,
}) => {
    const setNextViewport = useStore((state) => state.setNextViewport);
    const setMapLoaded = useStore((state) => state.setMapLoaded);

    return (
        <ReactMapGL
            getCursor={() => cursor}
            attributionControl={false}
            {...viewport}
            onClick={onClick}
            scrollZoom={scrollZoom}
            width={width}
            height={height}
            onLoad={() => setMapLoaded()}
            mapStyle="mapbox://styles/newjerem/ckfb4pavw2ygh19ocjgzg0c0y"
            onViewportChange={(nextViewport) => setNextViewport(nextViewport)}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        >
            {children}
        </ReactMapGL>
    );
};
export default Map;
