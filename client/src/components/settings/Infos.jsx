import "./_SettingsAccount.scss";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axios } from "../../API";

import { useQuery } from "react-query";
import CardSettings from "../card/CardSettings";

//folder
import { getUserProfile } from "../../API";
import { RegularBtn } from "../shared/Buttons";
import { validateUserInfo } from "../../utils/validations";

const SettingsAccount = ({ isMobileScreen }) => {
    const [isEditing, setIsEditing] = useState("");

    const { data: userProfile, refetch } = useQuery("GET_USER_PROFILE", getUserProfile);
    const { register, errors, handleSubmit } = useForm();

    const openEditing = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };
    const cancelEditing = (e) => {
        e.preventDefault();
        setIsEditing(false);
        refetch();
    };

    const editCredentials = async (cred) => {
        try {
            await axios.patch("/users/updateProfile", cred);
            refetch();
            setIsEditing(false);
        } catch (err) {
            console.err(err);
        }
    };

    return (
        <CardSettings title="Informations">
            <dl className={`card__table ${isMobileScreen ? "m" : ""}`}>
                <form onSubmit={handleSubmit((cred) => editCredentials(cred))}>
                    <div className="card__table--line">
                        <dt className="card__table--line__name">Name:</dt>
                        {isEditing ? (
                            <div className="card__table--line__input-container">
                                <input
                                    ref={register(validateUserInfo.name)}
                                    name="name"
                                    type="text"
                                    defaultValue={userProfile.name}
                                    className="card__table--line__input"
                                />
                                <small className="card__table--line__error">
                                    {errors.name && errors.name.message}
                                </small>
                            </div>
                        ) : (
                            <dd className="card__table--line__value">{userProfile.name}</dd>
                        )}
                    </div>
                    <div className="card__table--line">
                        <dt className="card__table--line__name">Address e-mail:</dt>
                        {isEditing ? (
                            <div className="card__table--line__input-container">
                                <input
                                    ref={register(validateUserInfo.email)}
                                    name="email"
                                    type="email"
                                    defaultValue={userProfile.email}
                                    className="card__table--line__input"
                                />
                                <small className="card__table--line__error">
                                    {errors.email && errors.email.message}
                                </small>
                            </div>
                        ) : (
                            <dd className="card__table--line__value">{userProfile.email}</dd>
                        )}
                    </div>
                    <div className="card__btns">
                        {isEditing ? (
                            <>
                                <RegularBtn onClick={cancelEditing} spacing="2.8" color="theme-4">
                                    cancel editing
                                </RegularBtn>
                                <RegularBtn color="theme-1" spacing="3">
                                    save content
                                </RegularBtn>
                            </>
                        ) : (
                            <RegularBtn
                                arrowRight
                                onClick={openEditing}
                                color="theme-5"
                                spacing="2.5"
                            >
                                edit content
                            </RegularBtn>
                        )}
                    </div>
                </form>
            </dl>
        </CardSettings>
    );
};

export default SettingsAccount;
