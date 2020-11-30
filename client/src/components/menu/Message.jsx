import "./_MenuNotification.scss";
import React from "react";
import { axios } from "../../API";
import { useHistory, useLocation } from "react-router-dom";

// => folder
import { useStore } from "../../store";
import CardGlobal from "../card/CardGlobal";
import { timeFromNow } from "../../utils/dates";
import { truncate } from "lodash";

const Message = ({ msg, refetch }) => {
    const { replace, push } = useHistory();
    const location = useLocation();
    const setPannel = useStore((state) => state.setPannel);
    const setActionPerformed = useStore((state) => state.setActionPerformed);
    const markNotificationRead = async (id) => {
        try {
            const { status } = await axios.patch(`/notifications/${id}`, null);
            if (status === 200) {
                refetch();
            }
        } catch (err) {
            console.error(err);
        }
    };
    const goToDiscussion = () => {
        push(`/pm/${msg.receiver._id}`);
        setPannel("messenger", false);
        markNotificationRead(msg._id);
    };
    const archiveDiscussion = async () => {
        try {
            await axios.delete(`/notifications/${msg._id}`);
            refetch();
            if (location.pathname === `/pm/${msg.receiver._id}`) {
                replace("/pm");
                setActionPerformed();
            }
        } catch ({ response }) {
            console.error(response);
        }
    };

    return (
        <CardGlobal
            name={msg.receiver.name}
            userImg={msg.receiver.photo}
            read={msg.read}
            onClick={goToDiscussion}
            primaryTextAction="archive discussion"
            primaryMenuAction={archiveDiscussion}
            title={truncate(msg.receiver.name.split(" ")[0], { length: 29 })}
            text={truncate(msg.lastMessage, { length: 31 })}
            tsp={timeFromNow(msg.receivedAt)}
        />
    );
};
export default Message;
