import "./_DashboardSearch.scss";
import React, { useRef } from "react";
import InputMapSearch from "../Input/InputMapSearch";
import useOnClickOutside from "use-onclickoutside";

import { useStore } from "../../store";
import useResponsive from "../../hooks/useResponsive";
import { IconBtn } from "../shared/Buttons";
import { Cross } from "../../assets/svgs/icons";

const DashboardSearch = () => {
    const setPannel = useStore((state) => state.setPannel);

    const searchBoxRef = useRef();
    useOnClickOutside(searchBoxRef, () => setPannel("search", false));
    const { isMobileScreen } = useResponsive();
    return (
        <div className={`d-search ${isMobileScreen ? "m" : ""}`}>
            <div ref={searchBoxRef} className="container">
                <IconBtn onClick={() => setPannel("search", false)} className="d-search__btn">
                    <Cross />
                </IconBtn>
                <span className="d-search__title">Search for a place</span>
                <InputMapSearch background="light-grey" />
                <span className="d-search__help">example : Brooklyn, New york</span>
            </div>
        </div>
    );
};

export default DashboardSearch;
