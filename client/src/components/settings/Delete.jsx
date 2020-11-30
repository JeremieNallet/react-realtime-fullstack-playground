import "./_Delete.scss";
import React, { useState } from "react";

import { useQuery } from "react-query";
import { RegularBtn } from "../shared/Buttons";
import CardSettings from "../card/CardSettings";
import { getUserProfile, getUserGroup, axios } from "../../API";
import { signOutUser } from "../../API";
import { useStore } from "../../store";

const Delete = () => {
    const disconnectUser = useStore((state) => state.disconnectUser);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const [showModal, setShowModal] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const [error, setError] = useState("");
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    const { data: userGroup } = useQuery("GET_USER_GROUP", getUserGroup);
    const deleteAccount = async () => {
        if (userProfile.email === inputVal) {
            setBigLoader(true);
            try {
                if (userGroup) await axios.delete(`/groups/${userGroup._id}`);
                await axios.delete("/users/deleteUserData");
                setBigLoader(false);
                signOutUser(() => disconnectUser());
            } catch ({ response }) {
                setBigLoader(false);
                console.error(response);
            }
        }
    };
    const cancel = () => {
        setShowModal(false);
        setError("");
    };
    return (
        <>
            {showModal && (
                <div className={`modal-delete-account ${error ? "error" : ""}`}>
                    <CardSettings title="Confirmation required">
                        <span className="modal-delete-account__text">
                            Please enter your email to continue :
                        </span>
                        <input
                            onChange={({ target: { value } }) => {
                                setInputVal(value);
                                setError("");
                            }}
                            className="modal-delete-account__input"
                            type="text"
                        />
                        <span className="modal-delete-account__help">
                            {error ? "incorrect email" : userProfile.email}
                        </span>
                        <div className="modal-delete-account__btns">
                            <RegularBtn spacing="4" onClick={cancel} color="theme-4">
                                cancel
                            </RegularBtn>
                            <RegularBtn spacing="4" onClick={deleteAccount} color="theme-2">
                                delete
                            </RegularBtn>
                        </div>
                    </CardSettings>
                </div>
            )}

            <CardSettings title="Delete account">
                <p className="delete-message">
                    This will permanently delete all your data, please be cautious, there is no
                    going back.
                </p>
                <RegularBtn
                    spacing="2"
                    arrowRight
                    onClick={() => setShowModal(true)}
                    color="theme-2"
                >
                    Delete my account
                </RegularBtn>
            </CardSettings>
        </>
    );
};

export default Delete;
