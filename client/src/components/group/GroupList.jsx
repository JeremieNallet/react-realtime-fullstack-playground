import "./_GroupList.scss";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, usePaginatedQuery } from "react-query";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";

// -> folder
import { getAllGroupsWithin, getUserProfile } from "../../API";
import { useStore } from "../../store";
import { DoubleChevronLeft } from "../../assets/svgs/icons";
import { Loader } from "../shared/Loader";
import { truncate } from "lodash";
import { IconBtn, RegularBtn } from "../shared/Buttons";
import CardGroupList from "../card/CardGroupList";
import GroupSkeleton from "./GroupSkeleton";
import InputMapSearch from "../Input/InputMapSearch";
import localStorage from "local-storage";

const GroupList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilter] = useState(false);
    const [distanceValue, setDistanceValue] = useState(5);
    const [onRelease, setOnRelease] = useState(false);
    const [fakeLoader, setFakeLoader] = useState(false);
    const { push } = useHistory();
    const divRef = useRef();
    const pannel = useStore((state) => state.pannel);
    const switchIsCreatingTrue = useStore((state) => state.switchIsCreatingTrue);
    const setPannel = useStore((state) => state.setPannel);
    const setUser = useStore((state) => state.setUser);
    const user = useStore((state) => state.user);

    useQuery("GET_USER_PROFILE", getUserProfile, {
        onSuccess: (data) => {
            setUser("hasGroup", data.hasGroup);
        },
    });

    const { resolvedData: groupList, status } = usePaginatedQuery(
        user.position && [
            "GET_ALLL_GROUPS_WITHIN",
            user.spot,
            user.distance,
            `${user.position.lat},${user.position.long}`,
            currentPage,
        ],
        user.position && getAllGroupsWithin
    );

    const createGroup = () => {
        push("/create");
        switchIsCreatingTrue();
    };

    const styles = {
        display: `${pannel.side ? "" : "none"}`,
        opacity: user.isAddingPosition ? 0.2 : 1,
        pointerEvents: user.isAddingPosition ? "none" : "initial",
    };

    const [pageNumbers, setPageNumbers] = useState([]);

    const openEmojisPannelForAdding = () => {
        setPannel("emojis", true);
        setUser("isUpdatingEmoji", false);
    };
    const closeSidePannel = () => {
        localStorage.set("side", false);
        setPannel("side", false);
    };

    const updateViewport = useStore((state) => state.updateViewport);
    const locateMyGroup = (lat, long) => {
        updateViewport({ latitude: lat, longitude: long, zoom: 16.5 });
    };

    useEffect(() => {
        if (groupList) {
            setCurrentPage((prev) => (groupList.totalGroups <= 5 ? 1 : prev));
            setPageNumbers([...Array(groupList.totalPages).keys()].map((key) => key + 1));
            divRef.current.scrollTop = 0;
        }
    }, [groupList]);

    const newDistanceRadus = async ({ target: { value } }) => {
        setDistanceValue(value);
    };

    useEffect(() => {
        if (onRelease && distanceValue !== user.distance) {
            setOnRelease(false);
            setFakeLoader(true);
            setUser("distance", distanceValue);
            setTimeout(() => {
                setFakeLoader(false);
            }, 900);
        }
    }, [distanceValue, fakeLoader, onRelease, setUser, user.distance]);

    return (
        <div style={styles} ref={divRef} className="g-list">
            <IconBtn onClick={closeSidePannel} className="g-list__pannel-btn">
                <DoubleChevronLeft />
            </IconBtn>
            <div className="g-list__nav">
                {!user.position ? (
                    <InputMapSearch
                        className="g-list__nav--search-input"
                        background="light-grey"
                        border="theme-1"
                    />
                ) : (
                    <div className="g-list__nav--current-position">
                        <span>{truncate(user.spot, { length: 27 })}</span>
                        <RegularBtn
                            onClick={() => setShowFilter(!showFilters)}
                            spacing="2.3"
                            color="theme-5"
                        >
                            add filters
                        </RegularBtn>
                    </div>
                )}

                {status === "success" && user.position && !showFilters && (
                    <span className="g-list__nav--status">
                        {groupList.totalGroups <= 0 ? (
                            <>
                                {groupList.totalGroups}{" "}
                                {`group${groupList.totalGroups > 1 ? "s" : ""}`} found here{" "}
                                {!user.hasGroup && (
                                    <span onClick={createGroup} className="interactive-span">
                                        create one
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="highlighted-span">
                                    {groupList.totalGroups}{" "}
                                    {`group${groupList.totalGroups > 1 ? "s" : ""}`}{" "}
                                </span>{" "}
                                found here{" "}
                            </>
                        )}
                    </span>
                )}

                {!user.position && (
                    <span className="g-list__nav--status">
                        <span onClick={openEmojisPannelForAdding} className="interactive-span">
                            share your position
                        </span>{" "}
                        to find groups
                    </span>
                )}

                {showFilters && user.position && (
                    <div className={`filter-pannel ${fakeLoader ? "seeking" : ""}`}>
                        <div className="f-radius">
                            <div className="container">
                                <div className="f-radius--name">Distance radius :</div>
                                <div className="f-radius--distance">{distanceValue} km</div>
                            </div>
                            <input
                                onMouseUp={() => setOnRelease(true)}
                                onChange={newDistanceRadus}
                                value={distanceValue}
                                min="0"
                                max="10"
                                step="1"
                                className={`distance--input ${fakeLoader ? "blocked" : ""}`}
                                type="range"
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="g-list__items">
                <>
                    {user.position ? (
                        <>
                            {status === "loading" || fakeLoader ? (
                                <div className="loading-container">
                                    <Loader />
                                </div>
                            ) : status === "error" ? (
                                <div>error</div>
                            ) : (
                                <>
                                    {groupList.data.map((group) => (
                                        <CardGroupList
                                            locateGroup={() =>
                                                locateMyGroup(
                                                    group.location.coordinates[1],
                                                    group.location.coordinates[0]
                                                )
                                            }
                                            key={group._id}
                                            {...group}
                                        />
                                    ))}
                                    {groupList.totalGroups === 0 && (
                                        <>
                                            {Array.from({ length: 3 }, (_, i) => (
                                                <GroupSkeleton key={i} />
                                            ))}
                                        </>
                                    )}
                                    {groupList.data.length < groupList.totalGroups && (
                                        <ReactPaginate
                                            pageCount={pageNumbers.length}
                                            previousLabel={"prev"}
                                            nextLabel={"next"}
                                            onPageChange={({ selected }) =>
                                                setCurrentPage(selected + 1)
                                            }
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={3}
                                            containerClassName={"pagination"}
                                            subContainerClassName={"pages"}
                                            activeClassName={"active"}
                                            breakLabel={"..."}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {Array.from({ length: 3 }, (_, i) => (
                                <GroupSkeleton key={i} />
                            ))}
                        </>
                    )}
                </>
            </div>
        </div>
        // <div ref={divRef} style={listStyle} className={`group-list ${isMobileScreen ? "m" : ""}`}>
        //     <div className="container">
        //         {!isMobileScreen && (
        //             <IconBtn onClick={closeSidePannel} className="group-list__close-pannel">
        //                 <DoubleChevronLeft />
        //             </IconBtn>
        //         )}
        //         {!user.position && (
        //             <div className="group-list__no-pos">
        //                 <InputMapSearch
        //                     className="group-list__no-pos--input"
        //                     background="light-grey"
        //                     border="theme-1"
        //                     width="100%"
        //                 />
        //                 <span className="group-list__no-pos--message">
        //                     <span onClick={openEmojisPannelForAdding}>Share your position</span> to
        //                     find groups.
        //                 </span>
        //                 {Array.from({ length: 3 }, (_, i) => (
        //                     <GroupSkeleton key={i} />
        //                 ))}
        //             </div>
        //         )}
        //         <div className="group-list__pos">
        //             <div className="container">
        //                 {!isMobileScreen && (
        //                     <div className="group-list__pos--spot">
        //                         <span className="name">{truncate(user.spot, { length: 17 })}</span>
        //                     </div>
        //                 )}

        //                 {groupList && (
        //                     <div className="group-list__pos--filters">
        //                         <button
        //                             onClick={() => setShowFilter(!showFilters)}
        //                             className="filter-btn"
        //                         >
        //                             <span className="filter-btn--text">Add filters</span>
        //                         </button>
        //                     </div>
        //                 )}
        //             </div>
        //             {showFilters && (
        //                 <div className="group-list__filters">
        //                     <div className="distance">
        //                         <div className="distance__info">
        //                             <div className="distance__info--text">Distance radius :</div>
        //                             <div className="distance__info--number">{user.distance} km</div>
        //                         </div>
        //                         <input
        //                             onMouseUp={() => setOnRelease(true)}
        //                             onChange={newDistanceRadus}
        //                             value={distanceValue}
        //                             min="0"
        //                             max="10"
        //                             step="1"
        //                             className={`distance--input ${fakeLoader ? "blocked" : ""}`}
        //                             type="range"
        //                         />
        //                     </div>
        //                 </div>
        //             )}

        //             {status === "success" && groupList.totalGroups <= 0 && (
        //                 <span
        //                     className={`group-list__pos--results create ${
        //                         isMobileScreen ? "m" : ""
        //                     }`}
        //                 >
        //                     0 group in this area{" "}
        //                     {!user.hasGroup && <span onClick={createGroup}>create one.</span>}
        //                 </span>
        //             )}

        //             {status === "success" && groupList.totalGroups > 0 && (
        //                 <span className="group-list__pos--results">
        //                     <span>
        //                         {groupList.totalGroups}{" "}
        //                         {`group${groupList.totalGroups > 1 ? "s" : ""}`}
        //                     </span>{" "}
        //                     found around here !
        //                 </span>
        //             )}
        //         </div>
        //         {status === "loading" || fakeLoader ? (
        //             <div className="group-list__loading">
        //                 <Loader />
        //             </div>
        //         ) : status === "error" ? (
        //             <div>error</div>
        //         ) : (
        //             <>
        //                 <div className="group-list__items">
        //                     {!isMobileScreen && groupList.totalGroups <= 0 ? (
        //                         <div className="group-list__items--skeletons">
        //                             {Array.from({ length: 3 }, (_, i) => (
        //                                 <GroupSkeleton key={i} />
        //                             ))}
        //                         </div>
        //                     ) : (
        //                         <div className="group-list__items--groups">
        //                             {groupList.data.map((group) => (
        //                                 <CardGroupList
        //                                     locateGroup={() =>
        //                                         locateMyGroup(
        //                                             group.location.coordinates[1],
        //                                             group.location.coordinates[0]
        //                                         )
        //                                     }
        //                                     key={group._id}
        //                                     {...group}
        //                                 />
        //                             ))}
        //                         </div>
        //                     )}
        //                 </div>
        //                 {groupList.totalGroups >= 10 ? (
        //                     <ReactPaginate
        //                         pageCount={pageNumbers.length}
        //                         previousLabel={"prev"}
        //                         nextLabel={"next"}
        //                         onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        //                         marginPagesDisplayed={1}
        //                         pageRangeDisplayed={3}
        //                         containerClassName={"pagination"}
        //                         subContainerClassName={"pages"}
        //                         activeClassName={"active"}
        //                         breakLabel={"..."}
        //                     />
        //                 ) : (
        //                     <>
        //                         {groupList.totalGroups > 0 && (
        //                             <small className="group-list__results">
        //                                 {groupList && groupList.totalGroups} results - stumbly
        //                                 &copy; 2020
        //                             </small>
        //                         )}
        //                     </>
        //                 )}
        //             </>
        //         )}
        //     </div>
        // </div>
    );
};

export default GroupList;
