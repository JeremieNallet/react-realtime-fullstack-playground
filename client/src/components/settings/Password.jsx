import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { axios } from "../../API";
// import axios from "axios"
// folder
import { signOutUser } from "../../API";
import { validateUserInfo } from "../../utils/validations";
import { useStore } from "../../store";
import { Input } from "../Input/InputSettings";
import { RegularBtn } from "../shared/Buttons";
import CardSettings from "../card/CardSettings";

const Password = ({ isMobileScreen }) => {
    const [isEditing, setIsEditing] = useState(false);
    const disconnectUser = useStore((state) => state.disconnectUser);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const { register, errors, handleSubmit, watch } = useForm();
    const [localServerError, setLocalServerError] = useState("");

    const editPassword = async (cred) => {
        setBigLoader(true);
        try {
            const { status } = await axios.patch("/users/updatePassword", cred);
            if (status === 200) {
                setBigLoader(false);
                signOutUser(() => disconnectUser());
            }
        } catch (err) {
            setBigLoader(false);
            setLocalServerError("wrong password");
        }
    };
    const password = useRef();
    password.current = watch("password", "");
    const verifyPasswords = () => {
        return {
            validate: (typed) =>
                typed === password.current || validateUserInfo.confirmPassword,
        };
    };

    const cancelEditing = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };
    const openEditing = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };

    return (
        <CardSettings title="Password">
            <dl className={`card__table ${isMobileScreen ? "m" : ""}`}>
                <form onSubmit={handleSubmit((cred) => editPassword(cred))}>
                    <div className="card__table--line">
                        <dt className="card__table--line__name">
                            Current password:
                        </dt>
                        <Input
                            value={`${isEditing ? "" : "********"}`}
                            isEditing={isEditing}
                            serverError={localServerError}
                            onChange={() =>
                                localServerError && setLocalServerError("")
                            }
                            errorType={errors.currentPassword}
                            forwardRef={register(
                                validateUserInfo.currentPassword
                            )}
                            name="currentPassword"
                            type="password"
                        />
                    </div>
                    <div className="card__table--line">
                        <dt className="card__table--line__name">
                            New password
                        </dt>
                        <Input
                            value={`${isEditing ? "" : "********"}`}
                            isEditing={isEditing}
                            errorType={errors.password}
                            forwardRef={register(validateUserInfo.password)}
                            name="password"
                            type="password"
                        />
                    </div>
                    <div className="card__table--line">
                        <dt className="card__table--line__name">
                            Confirm password
                        </dt>
                        <Input
                            value={`${isEditing ? "" : "********"}`}
                            isEditing={isEditing}
                            errorType={errors.confirmPassword}
                            forwardRef={register(verifyPasswords())}
                            name="confirmPassword"
                            type="password"
                        />
                    </div>

                    <div className="card__btns">
                        {isEditing ? (
                            <>
                                <RegularBtn
                                    onClick={cancelEditing}
                                    spacing="2.8"
                                    color="theme-4"
                                >
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

export default Password;
