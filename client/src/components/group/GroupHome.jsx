import "./_GroupHome.scss";
import React, { useState, useEffect } from "react";

//folder
import { useStore } from "../../store";
import Map from "../shared/Map";
import useResponsive from "../../hooks/useResponsive";
import { axios } from "../../API";
import { useHistory } from "react-router-dom";
import { truncate } from "lodash";

import { MapPin } from "../../assets/svgs/icons";
import { RegularBtn } from "../shared/Buttons";
import ModalConfirm from "../modals/ModalConfirm";
import { getOneGroup } from "../../API";
import { useQuery } from "react-query";

const GroupHome = ({ slug }) => {
    const viewPortState = useStore((state) => state.viewPortState);
    const setNextViewport = useStore((state) => state.setNextViewport);
    const updateViewport = useStore((state) => state.updateViewport);
    const membershipRole = useStore((state) => state.membershipRole);
    const setMembershipRole = useStore((state) => state.setMembershipRole);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const setGroup = useStore((state) => state.setGroup);

    const [isLeaving, setIsLeaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [maxLength, setMaxLength] = useState(35);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [spot, setSpot] = useState("");
    const [address, setAddress] = useState("");
    const [titleError, setTitleError] = useState(null);
    const [description, setDescription] = useState("");

    const { push } = useHistory();
    const { isMobileScreen } = useResponsive();
    const { data: oneGroup } = useQuery(slug && ["GET_ONE_GROUP", slug], getOneGroup);

    useEffect(() => {
        if (oneGroup) {
            const [long, lat] = oneGroup.data.location.coordinates;
            updateViewport({ latitude: lat, longitude: long, zoom: 18 });
        }
    }, [oneGroup, updateViewport]);

    const saveEdit = async () => {
        if (title.length > 4) {
            try {
                await axios.patch(`/groups/${slug}`, { title, description });
                setIsEditing(false);
                setTitleError(null);
            } catch (err) {
                console.log(err);
            }
        } else {
            setTitleError("Title is too short !");
        }
    };
    const cancelEdit = () => {
        setIsEditing(false);
        setTitle(oneGroup.data.title);
        setDescription(oneGroup.data.description);
        setAddress(oneGroup.data.address);
        setSpot(oneGroup.data.room);
    };

    const joinGroup = async () => {
        setBigLoader(true);
        try {
            await axios.post("/members", {
                groupInfo: oneGroup.data._id,
                groupSlug: oneGroup.data.slug,
            });
            setMembershipRole("member");
            setTimeout(() => setBigLoader(false), 1000);
        } catch (err) {
            console.error(err);
            setTimeout(() => setBigLoader(false), 1000);
        }
    };

    const leaveGroup = async () => {
        setBigLoader(true);
        try {
            await axios.delete(`/members/${slug}`);
            setTimeout(() => setBigLoader(false), 1000);
            setMembershipRole(null);
            setIsLeaving(false);
        } catch (err) {
            setBigLoader(false);
            console.error(err);
        }
    };

    const deleteGroup = async () => {
        if (oneGroup) {
            setIsDeleting(true);
            try {
                const { status } = await axios.delete(`/groups/${oneGroup.data._id}`);
                setBigLoader(true);
                if (status === 200) {
                    setTimeout(() => {
                        setIsDeleting(false);
                        setBigLoader(false);
                        setGroup("title", null);
                        setGroup("position", null);
                        push("/");
                    }, 1000);
                }
            } catch (err) {
                setBigLoader(false);
                setIsDeleting(false);
                console.log(err);
            }
        } else return;
    };

    const cancelDeleteGroup = () => setIsDeleting(false);

    useEffect(() => {
        if (oneGroup) {
            setTitle(oneGroup.data.title);
            setDescription(oneGroup.data.description);
            setAddress(oneGroup.data.address);
            setSpot(oneGroup.data.room);
        }
    }, [oneGroup]);

    return (
        <>
            {oneGroup && (
                <div className="group-home">
                    {!isMobileScreen && (
                        <div className="group-home__map">
                            <Map
                                width="100%"
                                height="100%"
                                viewport={viewPortState}
                                onViewportChange={(nextViewport) => setNextViewport(nextViewport)}
                            />
                        </div>
                    )}
                    <>
                        {isLeaving && (
                            <ModalConfirm
                                onConfirm={leaveGroup}
                                text="Are you sure you want tp leave this group ?"
                                onCancel={() => setIsLeaving(false)}
                            />
                        )}
                        {isDeleting && (
                            <ModalConfirm
                                onConfirm={deleteGroup}
                                onCancel={cancelDeleteGroup}
                                text="This action will permanently delete the group"
                            />
                        )}
                        <div className={`group-home-cell ${isMobileScreen ? "m" : ""}`}>
                            <div className="group-home-cell__head">
                                <img className="head-img" src={oneGroup.data.img} alt="group" />
                            </div>
                            <div className="container">
                                {!isEditing ? (
                                    <div className="group-home-cell__title">
                                        <h4 className="title-text">{title}</h4>
                                    </div>
                                ) : (
                                    <div className="title-editor">
                                        <input
                                            onChange={({ target: { value } }) => {
                                                setTitle(value);
                                                setTitleError(null);
                                            }}
                                            value={title}
                                            className="title-editor__input"
                                            type="text"
                                            maxLength="40"
                                        />
                                        {titleError ? (
                                            <small className="title-editor__limit error">
                                                {titleError}
                                            </small>
                                        ) : (
                                            <small className="title-editor__limit">
                                                maximum {40 - title.length} characters
                                            </small>
                                        )}
                                    </div>
                                )}
                                {!isEditing && description && (
                                    <div className="group-home-cell__description">
                                        <span className="description-title">About :</span>
                                        <p className="description-text">
                                            {truncate(description, { length: maxLength })}

                                            {description.length > maxLength && (
                                                <span
                                                    onClick={() => setMaxLength(Infinity)}
                                                    className="read-more"
                                                >
                                                    read more
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="description-editor">
                                        <textarea
                                            onChange={({ target: { value } }) =>
                                                setDescription(value)
                                            }
                                            value={description}
                                            type="text"
                                            className="description-editor__textarea"
                                            maxLength="400"
                                            placeholder="Add a description ..."
                                        />
                                    </div>
                                )}
                                {!isEditing && (
                                    <div className="group-home-cell__location">
                                        <div className="location-address">
                                            <span className="location-text__city">{spot}</span>
                                            <p className="location-text__place">
                                                <span>{address}</span>
                                            </p>
                                        </div>
                                        <div className="location-icon">
                                            <MapPin />
                                        </div>
                                    </div>
                                )}

                                <div className="group-home-cell__btns">
                                    {membershipRole === null && (
                                        <>
                                            <RegularBtn
                                                arrowRight
                                                fullWidth
                                                color="theme-1"
                                                onClick={joinGroup}
                                            >
                                                join this group
                                            </RegularBtn>
                                            <span className="members-count">
                                                {oneGroup.groupMembers} members.
                                            </span>
                                        </>
                                    )}
                                    {membershipRole === "member" && (
                                        <>
                                            <RegularBtn
                                                fullWidth
                                                color="theme-4"
                                                onClick={() => setIsLeaving(true)}
                                            >
                                                leave group
                                            </RegularBtn>
                                            <span className="members-count">
                                                {oneGroup.groupMembers} members.
                                            </span>
                                        </>
                                    )}
                                    {membershipRole === "admin" && !isEditing && (
                                        <>
                                            <RegularBtn
                                                fullWidth
                                                color="theme-1"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Edit informations
                                            </RegularBtn>
                                            <RegularBtn
                                                fullWidth
                                                color="theme-4"
                                                onClick={() => setIsDeleting(true)}
                                            >
                                                delete my group
                                            </RegularBtn>
                                        </>
                                    )}

                                    {membershipRole === "admin" && isEditing && (
                                        <>
                                            <RegularBtn
                                                fullWidth
                                                color="theme-1"
                                                onClick={saveEdit}
                                            >
                                                save
                                            </RegularBtn>
                                            <RegularBtn
                                                arrowLeft
                                                fullWidth
                                                color="theme-4"
                                                onClick={cancelEdit}
                                            >
                                                cancel
                                            </RegularBtn>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            )}
        </>
    );
};

export default GroupHome;
