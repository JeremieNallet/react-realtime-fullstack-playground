import "./_Messenger.scss";
import React, { useEffect } from "react";
import { getReceivedMessages } from "../../API";
import { useInfiniteQuery } from "react-query";
import CardGlobal from "../card/CardGlobal";
import { useHistory } from "react-router";
import { axios } from "../../API";

import { LoadMoreBtn } from "../shared/Buttons";
import useResponsive from "../../hooks/useResponsive";
import Loader from "../shared/Loader";
import { timeFromNow } from "../../utils/dates";
import { NavLink } from "react-router-dom";

import { messengerSocket } from "../../utils/sockets";
import { useStore } from "../../store";

const MessengerDiscussions = () => {
    const { replace } = useHistory();
    const actionPerformed = useStore((state) => state.actionPerformed);
    const { status, data, isFetchingMore, fetchMore, canFetchMore, refetch } = useInfiniteQuery(
        "GET_RECEIVED_MESSAGES_LIST",
        getReceivedMessages,
        {
            getFetchMore: (lastGroup) => lastGroup.nextPage,
        }
    );

    useEffect(() => {
        messengerSocket.on("MESSENGER_RECEIVED_MSG", ({ lastMessage, chat }) => {
            refetch();
        });
    }, [refetch]);

    const markNotificationRead = async (noti) => {
        try {
            const { status } = await axios.patch(`/notifications/${noti._id}`, null);
            if (status === 200) {
                refetch();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const { isMobileScreen } = useResponsive();

    const archiveDiscussion = async (id) => {
        replace("/pm");
        try {
            await axios.delete(`/notifications/${id}`);
            refetch();
            replace("/pm");
        } catch ({ response }) {
            console.error(response);
        }
    };
    useEffect(() => {
        if (actionPerformed) {
            refetch();
        }
    }, [actionPerformed, refetch]);

    return (
        <nav className={`messenger__nav ${isMobileScreen ? "m" : ""}`}>
            {status === "loading" ? (
                <div className="messenger__nav--loading">
                    <Loader size="7" />
                </div>
            ) : status === "success" ? (
                <>
                    {data && data[0].data.length !== 0 && (
                        <span className="messenger__title">Messages</span>
                    )}
                    {data.map((message, i) => {
                        return (
                            <React.Fragment key={i}>
                                <React.Fragment key={i}>
                                    {message.data.map((el) => (
                                        <NavLink
                                            activeClassName="active"
                                            key={el._id}
                                            to={`/pm/${el.receiver._id}`}
                                        >
                                            <CardGlobal
                                                read={el.read}
                                                onClick={() => markNotificationRead(el)}
                                                name={el.receiver.name}
                                                userImg={el.receiver.photo}
                                                title={el.receiver.name}
                                                text={el.lastMessage}
                                                primaryTextAction="delete conversation"
                                                primaryMenuAction={() => archiveDiscussion(el._id)}
                                                tsp={timeFromNow(el.receivedAt)}
                                            />
                                        </NavLink>
                                    ))}
                                </React.Fragment>
                            </React.Fragment>
                        );
                    })}
                    {canFetchMore && (data && data[0].count) !== 0 && (
                        <LoadMoreBtn
                            onClick={() => fetchMore()}
                            disabled={!canFetchMore || isFetchingMore}
                            isFetchingMore={isFetchingMore}
                            canFetchMore={canFetchMore}
                        />
                    )}
                </>
            ) : (
                <div>error</div>
            )}
        </nav>
    );
};

export default MessengerDiscussions;
