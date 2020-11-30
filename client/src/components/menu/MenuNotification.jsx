import "./_MenuNotification.scss";
import React from "react";
import { useInfiniteQuery } from "react-query";

// => folder

import Notification from "./Notification";
import { getReceivedNotifications } from "../../API";
import MenuLayout from "./MenuLayout";
import { LoadMoreBtn } from "../shared/Buttons";
import { Loader } from "../shared/Loader";
import EmptyText from "../shared/EmptyText";
import useResponsive from "../../hooks/useResponsive";
import { useStore } from "../../store";

const MenuNotification = () => {
    const pannel = useStore((state) => state.pannel);
    const { status, data, isFetchingMore, fetchMore, canFetchMore, refetch } = useInfiniteQuery(
        "GET_RECEIVED_NOTIFICATIONS_INF",
        getReceivedNotifications,
        {
            getFetchMore: (lastGroup, allGroups) => lastGroup.nextPage,
            refetchOnWindowFocus: false,
        }
    );
    const { isMobileScreen } = useResponsive();

    return (
        <MenuLayout togglePannel={pannel.notifications} menuBtn title="Notifications">
            <>
                {status === "loading" ? (
                    <>
                        {isMobileScreen ? (
                            <div className="notification-loader">
                                <Loader size="7" />
                            </div>
                        ) : (
                            <Loader size="5" />
                        )}
                    </>
                ) : status === "error" ? (
                    <div>error</div>
                ) : (
                    <>
                        {data[0].data.length > 0 ? (
                            <>
                                {data.map((notifications, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            {notifications.data.map((notification) => (
                                                <Notification
                                                    refetch={refetch}
                                                    key={notification._id}
                                                    notification={notification}
                                                />
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                                {canFetchMore && data && data[0].count > 0 && (
                                    <LoadMoreBtn
                                        onClick={() => fetchMore()}
                                        disabled={!canFetchMore || isFetchingMore}
                                        isFetchingMore={isFetchingMore}
                                        canFetchMore={canFetchMore}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {isMobileScreen && (
                                    <div className="notification-empty">
                                        <EmptyText text="You have received no notification." />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        </MenuLayout>
    );
};

export default MenuNotification;
