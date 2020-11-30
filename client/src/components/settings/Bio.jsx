import "./_Bio.scss";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axios } from "../../API";

import { useQuery } from "react-query";
import CardSettings from "../card/CardSettings";

//folder
import { getUserProfile } from "../../API";
import { IconBtn, RegularBtn } from "../shared/Buttons";
import { Edit, Cross } from "../../assets/svgs/icons";
import UserImg from "../shared/UserImg";
import { validateUserInfo } from "../../utils/validations";
import ModalConfirm from "../modals/ModalConfirm";
import { useStore } from "../../store";
const Bio = ({ isMobileScreen }) => {
    const [isEditing, setIsEditing] = useState("");
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const { register, handleSubmit } = useForm();
    const { data, refetch } = useQuery("GET_USER_PROFILE", getUserProfile, {
        onSuccess: (data) => {
            if (data.description) {
                setDescriptionLength(data.description.length);
            }
        },
    });

    const editDescription = async (cred) => {
        try {
            await axios.patch(`/users/updateProfile`, cred);
            refetch();
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };
    const openEditing = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };
    const cancelEditing = (e) => {
        e.preventDefault();
        setIsEditing(false);
        refetch();
    };

    const [fileSetected, setFileSected] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const uploadPhoto = async () => {
        if (!fileSetected) return;
        setIsUploading(true);
        setBigLoader(true);
        try {
            const { status } = await axios.patch(`/users/userPhoto`, {
                photo: fileSetected,
            });
            if (status === 200) {
                setIsUploading(false);
                setFileSected("");
            }
            setBigLoader(false);
            window.location.reload();
        } catch (err) {
            setIsUploading(false);
            setFileSected("");
            console.error(err);
            setBigLoader(false);
        }
    };

    const deletePhoto = async () => {
        setBigLoader(true);
        try {
            await axios.delete(`/users/userPhoto`);
            setIsDeletingPhoto(false);
            setBigLoader(false);
            window.location.reload();
        } catch (err) {
            console.error(err, "there was an issue when deleting the photo");
            setBigLoader(false);
        }
    };

    const fileInputChange = ({ target }) => {
        const file = target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => setFileSected(reader.result);
        }
    };

    return (
        <>
            {isDeletingPhoto && (
                <ModalConfirm onConfirm={deletePhoto} onCancel={() => setIsDeletingPhoto(false)} />
            )}
            {isMobileScreen && (
                <div className="m-bio-picture">
                    <form className="container">
                        <UserImg name={data && data.name} img={data && data.photo} size="15" />
                        {data.photo ? (
                            <label
                                onClick={() => setIsDeletingPhoto(true)}
                                className="bio__picture--btn"
                            >
                                <Cross />
                            </label>
                        ) : (
                            <label htmlFor="upload" className="bio__picture--btn">
                                <Edit />
                            </label>
                        )}

                        <input
                            onChange={fileInputChange}
                            style={{ display: "none" }}
                            id="upload"
                            name="image"
                            type="file"
                        />
                    </form>
                </div>
            )}
            <CardSettings
                help="The bio can be seen when a user clicks on your map emoji."
                title="Presentation"
            >
                <div className={`bio ${isMobileScreen ? "m" : ""}`}>
                    <form
                        onSubmit={handleSubmit((cred) => editDescription(cred))}
                        className="bio__description"
                    >
                        {!isEditing && <span>Bio : </span>}
                        {isEditing ? (
                            <>
                                <textarea
                                    onChange={(data) =>
                                        setDescriptionLength(data.target.value.length)
                                    }
                                    ref={register(validateUserInfo.description)}
                                    name="description"
                                    defaultValue={data.description}
                                    className="card__table--line__input textarea"
                                    type="text"
                                    maxLength={200}
                                />
                                <small>maximum : {200 - descriptionLength}</small>
                            </>
                        ) : (
                            <p>{data.description || "Click on edit content to write a bio."}</p>
                        )}
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
                    <div className="bio__picture">
                        <form className="container">
                            <UserImg name={data && data.name} img={data && data.photo} size="15" />

                            {data.photo ? (
                                <label
                                    onClick={() => setIsDeletingPhoto(true)}
                                    className="bio__picture--btn"
                                >
                                    <Cross />
                                </label>
                            ) : (
                                <label htmlFor="upload" className="bio__picture--btn">
                                    <Edit />
                                </label>
                            )}

                            <input
                                onChange={fileInputChange}
                                style={{ display: "none" }}
                                id="upload"
                                name="image"
                                type="file"
                            />
                        </form>
                    </div>
                </div>
            </CardSettings>
            {fileSetected && !isUploading && (
                <div className="bio-file-preview">
                    <div className="container">
                        <IconBtn onClick={() => setFileSected("")} className="close-btn">
                            <Cross />
                        </IconBtn>
                        <div className="img-container">
                            <img
                                className="bio-file-preview__img"
                                src={fileSetected}
                                alt="preview"
                            />
                        </div>
                        <div className="btn-container">
                            <RegularBtn
                                onTouchEnd={uploadPhoto}
                                onClick={uploadPhoto}
                                fullWidth
                                color="theme-4"
                            >
                                validate
                            </RegularBtn>
                        </div>
                    </div>
                    <small className="bio-file-preview__help">
                        You might need to refresh once validated to see the picture.
                    </small>
                </div>
            )}
        </>
    );
};

export default Bio;
