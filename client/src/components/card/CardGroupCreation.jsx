import "./_CardGroupCreation.scss";
import React from "react";

// -> folder
import { MapPin } from "../../assets/svgs/icons";

const CardGroupCreation = ({ img, description, title, spot, address }) => {
    return (
        <div className="c-group-creation">
            <div className="c-group-creation__head">
                <img className="head-img" src={img} alt="group" />
            </div>

            <div className="container">
                <div className="c-group-creation__title">
                    <h4 className="title-text">{title}</h4>
                </div>
                {description && (
                    <div className="c-group-creation__description">
                        <span className="description-title">About this group :</span>
                        <p className="description-text">{description}</p>
                    </div>
                )}
                <div className="c-group-creation__location">
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
            </div>
        </div>
    );
};

export default CardGroupCreation;
