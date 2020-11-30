import "./_UserImg.scss";
import { Image } from "cloudinary-react";
import React from "react";

//folder

const UserImg = ({ img, name = "", className, size = "5", pointer = false }) => {
    const imgSize = 42;
    return (
        <div
            style={{
                width: `${size}rem`,
                height: `${size}rem`,
                cursor: `${pointer ? "pointer" : "initial"}`,
            }}
            className={`user-img ${className}`}
        >
            {!img ? (
                <span>{name.charAt(0).toUpperCase()}</span>
            ) : (
                <Image
                    style={{ borderRadius: "100%" }}
                    width={imgSize}
                    height={imgSize}
                    cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                    publicId={img}
                />
            )}
        </div>
    );
};

export default UserImg;
