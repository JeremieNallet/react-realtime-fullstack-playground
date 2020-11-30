import "./_DashboardGroupMobile.scss";
import React from "react";

//folders
import { useTransition, animated as a } from "react-spring";
import { ChevrionDown } from "../../assets/svgs/icons";
import GroupList from "../group/GroupList";

import { useStore } from "../../store";
import { truncate } from "lodash";
import EmptyText from "../shared/EmptyText";
import { IconBtn } from "../shared/Buttons";
const DashboardGroupMobile = () => {
    const setPannel = useStore((state) => state.setPannel);
    const pannel = useStore((state) => state.pannel);
    const setUser = useStore((state) => state.setUser);
    const user = useStore((state) => state.user);

    const transition = useTransition(pannel.mobileGroup, null, {
        from: { transform: `translate3d(0, 100%, 0)` },
        enter: { transform: `translate3d(0, 0%, 0)` },
        leave: { transform: `translate3d(0, 100%, 0)` },
    });
    const prepareAddPosition = () => {
        setPannel("mobileGroup", false);
        setPannel("emojis", true);
        setUser("isUpdatingEmoji", false);
    };
    return (
        <>
            {transition.map(
                ({ item, key, props }) =>
                    item && (
                        <a.div
                            key={key}
                            style={props}
                            className="dashboard-group-list"
                        >
                            <nav className="dashboard-group-list__nav">
                                <IconBtn
                                    onClick={() =>
                                        setPannel("mobileGroup", false)
                                    }
                                >
                                    <ChevrionDown />
                                </IconBtn>

                                <span className="txt">
                                    {truncate(user.spot, { length: 17 })}
                                </span>
                            </nav>

                            {!user.position ? (
                                <div className="empty-content">
                                    <EmptyText
                                        action={prepareAddPosition}
                                        text="share your position to see groups around you"
                                    />
                                </div>
                            ) : (
                                <div className="content">
                                    <GroupList />
                                </div>
                            )}
                        </a.div>
                    )
            )}
        </>
    );
};

export default DashboardGroupMobile;
