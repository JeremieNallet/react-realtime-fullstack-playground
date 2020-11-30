import "./_MenuNotification.scss";
import React from "react";
import { axios } from "../../API";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { truncate } from "lodash";

// => folder
import { getOneUserPosition, getUserProfile } from "../../API";
import { useStore } from "../../store";
import { timeFromNow } from "../../utils/dates";
import CardGlobal from "../card/CardGlobal";
import waveSvg from "../../assets/svgs/img/wave.svg";
import invitation from "../../assets/svgs/img/messenger.svg";

const Notification = ({ notification, refetch }) => {
    const { sender, type, _id, read, updatedAt } = notification;
    const { push } = useHistory();
    const setBigLoader = useStore((state) => state.setBigLoader);
    const setServerError = useStore((state) => state.setServerError);
    const user = useStore((state) => state.user);
    const updateViewport = useStore((state) => state.updateViewport);
    const setPannel = useStore((state) => state.setPannel);
    const setMembershipRole = useStore((state) => state.setMembershipRole);

    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    const { data: userPosition } = useQuery(
        sender._id && ["GET_ONE_USER_POSITION", sender._id],
        getOneUserPosition
    );

    const markNotificationRead = async () => {
        try {
            const { status } = await axios.patch(`/notifications/${_id}`, null);
            if (status === 200) refetch();
        } catch ({ response }) {
            console.error(response);
        }
    };
    const getToUserPosition = async () => {
        if (userPosition && userPosition.room === user.spot) {
            const [long, lat] = userPosition.location.coordinates;
            updateViewport({ latitude: lat, longitude: long, zoom: 18 });
            markNotificationRead();
            setPannel("notifications", false);
        } else {
            setServerError("This user is either offline or in another zone");
        }
    };

    const deleteNotification = async () => {
        try {
            const { status } = await axios.delete(`/notifications/${_id}`);
            if (status === 200) {
                refetch();
            }
        } catch ({ response }) {
            console.error(response);
        }
    };

    const acceptGroupInvitation = async () => {
        if (userProfile) {
            setBigLoader(true);
            push(`/group/${notification.group.slug}`);
            try {
                const { status } = await axios.post(`/members`, {
                    groupInfo: notification.group._id,
                    groupSlug: notification.group.slug,
                    sender: sender._id,
                    isInvitation: true,
                    notificationId: _id,
                });
                if (status === 200) {
                    setPannel("notifications", false);
                    setMembershipRole("member");
                    setTimeout(() => setBigLoader(false), 1000);
                }
            } catch (err) {
                console.error(err);
                setTimeout(() => setBigLoader(false), 1000);
            }
        }
    };

    const waveBackToSender = async () => {
        const body = {
            notificationId: _id,
            receiverId: sender._id,
            senderId: userProfile._id,
        };
        try {
            const { status } = await axios.post(
                `/notifications/sendWaveBack`,
                body
            );
            if (status === 200) refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const element = {
        title: "",
        actionText: "",
        img: "",
        action: () => {},
    };

    switch (type) {
        case "wave":
            element.title = "waved received";
            element.text = `${sender.name} is waving at you !`;
            element.actionText = "wave back";
            element.img = waveSvg;
            element.action = waveBackToSender;
            break;
        case "wave-notice":
            element.title = "wave sent";
            element.text = `You waved at ${truncate(sender.name, {
                length: 25,
            })}.`;
            element.img = waveSvg;
            break;
        case "invitation-notice":
            element.title = "invitation sent";
            element.text = `You have invited ${truncate(sender.name, {
                length: 18,
            })} to your group.`;
            element.img = invitation;
            break;
        case "invitation-accepted":
            element.title = "invitation accepted";
            element.text = `${sender.name} accepted your invitation.`;
            element.img = invitation;
            break;
        case "invitation":
            element.title = "invitation received";
            element.text = `${sender.name} sent you a warm welcome.`;
            element.actionText = "Accept invitation";
            element.action = acceptGroupInvitation;
            element.img = invitation;
            break;
        default:
            return;
    }

    return (
        <>
            <CardGlobal
                tsp={timeFromNow(updatedAt)}
                read={read}
                img={element.img}
                title={element.title}
                actionText={element.actionText}
                action={element.action}
                text={element.text}
                primaryMenuAction={deleteNotification}
                secondaryMenuAction={markNotificationRead}
                secondaryTextAction="mark as read"
                primaryTextAction="delete"
                onClick={getToUserPosition}
            />
        </>
    );
};

export default Notification;
