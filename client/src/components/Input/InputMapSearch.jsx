import "./_InputMapSearch.scss";
import React, { useState, useCallback } from "react";
import Mapbox from "mapbox";

//folder
import debounce from "../../utils/debounce";
import { SearchMagnifier } from "../../assets/svgs/icons";
import { useStore } from "../../store";

const MapSearchInput = ({
    className,
    onClick,
    background = "lighter-grey",
}) => {
    const mapbox = new Mapbox(process.env.REACT_APP_MAPBOX_TOKEN);
    const [busyInput, setBusyInput] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [labelResult, setLabelResult] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const updateViewport = useStore((state) => state.updateViewport);

    const getResults = useCallback(
        debounce(async (searchValue) => {
            const params = { limit: 4 };
            if (searchValue) {
                try {
                    setShowResults(true);
                    const { entity } = await mapbox.geocodeForward(
                        searchValue,
                        params
                    );
                    setSearchResults(entity.features);
                } catch (error) {
                    setShowResults(false);
                    console.error(error);
                }
            }
        }, 300),
        []
    );

    const _onChange = async ({ target: { value } }) => {
        setInputValue(value);
        getResults(value);
    };
    const _onBlur = () => {
        setBusyInput(false);
        setShowResults(false);
    };
    const _onFocus = () => {
        setBusyInput(true);
    };

    const selectLocation = (coords, res) => {
        const [longitude, latitude] = coords;
        setShowResults(false);
        setInputValue("");
        setLabelResult(res);
        updateViewport({ latitude, longitude });
    };

    return (
        <div className={`input-map-search ${className}`}>
            <input
                type="search"
                style={{ background: `var(--color-${background})` }}
                value={inputValue}
                onChange={_onChange}
                onFocus={_onFocus}
                onBlur={_onBlur}
                className="input-map-search__input"
            />
            <SearchMagnifier
                iconColor={`${busyInput ? "theme-1" : "dark-grey"}`}
                className="input-map-search__icon"
            />
            {!busyInput && !inputValue && (
                <label className="input-map-search__label">
                    <span className="input-map-search__label--highlight">
                        {labelResult ? labelResult : "Search ..."}
                    </span>
                </label>
            )}

            {searchResults && showResults && (
                <ul className="input-map-search__results">
                    {searchResults.map(({ place_name, center: coords }, i) => {
                        const highlightResult = place_name.split(",")[0];

                        return (
                            <li
                                onClick={onClick}
                                onMouseDown={() => {
                                    selectLocation(coords, highlightResult);
                                }}
                                className="input-map-search__results--item"
                                key={i}
                            >
                                {place_name}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MapSearchInput;
