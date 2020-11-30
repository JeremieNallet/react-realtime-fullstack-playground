import "./_DashboardUser.scss";
import React, { useState } from "react";
import { useStore } from "../../store";
import { useQuery } from "react-query";
import {
    getPublicUser,
    getUserProfile,
    getUserGroup,
    checkDocument,
    checkMemberExists,
    axios,
} from "../../API";
import { useHistory } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";

import { Bell, Chat, UserPlus, Cross, Check } from "../../assets/svgs/icons";
import { Loader } from "../shared/Loader";
import { truncate } from "lodash";
import { messengerSocket } from "../../utils/sockets";
import { combineStatus } from "../../utils/combineStatus";
import { IconBtn } from "../shared/Buttons";

const DashboardUser = ({ currentUser }) => {
    const { push } = useHistory();
    const setServerError = useStore((state) => state.setServerError);
    const [alreadyWaved, setAlreadyWaved] = useState(false);
    const [alreadyInvited, setAlreadyInvited] = useState(false);
    const [memberExists, setMemberExists] = useState(false);
    const setPannel = useStore((state) => state.setPannel);
    const user = useStore((state) => state.user);
    const [readMoreCharLength, setReadMoreCharLength] = useState(28);
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    const { data: userGroup } = useQuery("GET_USER_GROUP_", getUserGroup);

    const { status: statusA, data: publicUser } = useQuery(
        ["GET_PUBLIC_USER", currentUser._id],
        currentUser._id && getPublicUser
    );

    const sendPm = () => {
        if (userProfile) {
            messengerSocket.emit("MESSENGER_OPEN", {
                sender: userProfile._id,
                receiver: currentUser._id,
            });
            push(`/pm/${currentUser._id}`);
        }
    };

    const sendInvitation = async () => {
        if (userProfile && userGroup && !alreadyInvited) {
            const body = {
                sender: userProfile._id,
                receiver: currentUser._id,
                groupId: userGroup._id,
            };
            try {
                await axios.post("/notifications/sendInvitation", body);
                setAlreadyInvited(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const { status: statusB } = useQuery(
        ["CHECK_DOCUMENT_WAVE", "wave", currentUser._id],
        checkDocument,
        {
            onSuccess: (data) => {
                setAlreadyWaved(data.waveExists);
            },
        }
    );
    const { status: statusC } = useQuery(
        ["CHECK_DOCUMENT_INV", "invitation", currentUser._id],
        checkDocument,
        {
            onSuccess: (data) => {
                setAlreadyInvited(data.invitationExists);
            },
        }
    );

    useQuery(
        ["CHECK_DOCUMENT_MEMBER", currentUser._id],
        user.hasGroup && checkMemberExists,
        {
            onSuccess: (data) => {
                if (user.hasGroup) {
                    setMemberExists(data.memberExists);
                }
            },
        }
    );

    const sendWave = async () => {
        if (userProfile && !alreadyWaved) {
            const body = { sender: userProfile._id, receiver: currentUser._id };
            try {
                const { status } = await axios.post(
                    "/notifications/sendWave",
                    body
                );
                if (status === 200) setAlreadyWaved(true);
            } catch (err) {
                setServerError(err.response.data.message);
            }
        }
    };

    const WaveIcon = alreadyWaved ? Check : Bell;
    const { status } = combineStatus([statusA, statusB, statusC]);
    return (
        <div className={`d-user ${useResponsive ? "m" : ""}`}>
            {status === "loading" ? (
                <div className="loading-container">
                    <Loader size="6" />
                </div>
            ) : status === "error" ? (
                <div>error</div>
            ) : (
                <div className="content-container">
                    <IconBtn
                        onClick={() => setPannel("userInfo", false)}
                        className="d-user__close"
                    >
                        <Cross />
                    </IconBtn>
                    <div className="d-user__user">
                        <img
                            className="d-user__user--emoji"
                            src={currentUser.emoji}
                            alt="user"
                        />
                        <p className="d-user__user--name">{publicUser.name}</p>
                        {publicUser.description && (
                            <p className="d-user__user--bio">
                                <>
                                    {truncate(publicUser.description, {
                                        length: readMoreCharLength,
                                    })}
                                    {readMoreCharLength <
                                        publicUser.description.trim()
                                            .length && (
                                        <span
                                            className="read-more"
                                            onClick={() =>
                                                setReadMoreCharLength(Infinity)
                                            }
                                        >
                                            read more
                                        </span>
                                    )}
                                </>
                            </p>
                        )}
                    </div>

                    <ul className="d-user__action">
                        <li
                            onClick={sendWave}
                            className={`action-item ${
                                alreadyWaved ? "performed" : ""
                            }`}
                        >
                            <WaveIcon className="action-item__icon" />
                            <span className="action-item__text">
                                {alreadyWaved ? "Wave sent !" : "Send a wave"}
                            </span>
                        </li>

                        <li onClick={sendPm} className="action-item">
                            <Chat className="action-item__icon" />
                            <span className="action-item__text">
                                Send a message
                            </span>
                        </li>
                        {!memberExists ? (
                            <li
                                onClick={sendInvitation}
                                className={`action-item ${
                                    alreadyInvited ? "performed" : ""
                                } ${!userGroup ? "disabled" : ""} `}
                            >
                                <UserPlus className="action-item__icon" />
                                <span className="action-item__text">
                                    {alreadyInvited
                                        ? "invitation sent"
                                        : "send invitation"}
                                </span>
                            </li>
                        ) : (
                            <li className="action-item performed">
                                <Check className="action-item__icon theme-1" />
                                <span className="action-item__text theme-1">
                                    I'm in your group
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DashboardUser;
