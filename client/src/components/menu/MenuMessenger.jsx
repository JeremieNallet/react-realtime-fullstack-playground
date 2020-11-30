import "./_MenuNotification.scss";
import React from "react";
import { useInfiniteQuery } from "react-query";

// => folder
import { getReceivedMessages } from "../../API";
import MenuLayout from "./MenuLayout";
import { LoadMoreBtn } from "../shared/Buttons";
import { Loader } from "../shared/Loader";
import Message from "./Message";
import { useStore } from "../../store";

const MenuNotification = () => {
    const pannel = useStore((state) => state.pannel);
    const { status, data, isFetchingMore, fetchMore, canFetchMore, refetch } = useInfiniteQuery(
        "GET_RECEIVED_MESSAGES_INF",
        getReceivedMessages,
        {
            getFetchMore: (lastGroup) => lastGroup.nextPage,
        }
    );

    return (
        <MenuLayout togglePannel={pannel.messenger} title="Messages">
            <>
                {status === "loading" ? (
                    <Loader />
                ) : status === "error" ? (
                    <div>error</div>
                ) : (
                    <>
                        {data[0].data.length > 0 && (
                            <>
                                {data.map((msgs, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            {msgs.data.map((msg) => (
                                                <Message
                                                    refetch={refetch}
                                                    key={msg._id}
                                                    msg={msg}
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
                        )}
                    </>
                )}
            </>
        </MenuLayout>
    );
};

export default MenuNotification;
