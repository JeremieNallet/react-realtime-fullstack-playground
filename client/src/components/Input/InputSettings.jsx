import "./_InputSettings.scss";
import React from "react";

export const Input = ({ isEditing, forwardRef, value, errorType, name, type, serverError, onChange }) => {
    return (
        <>
            {isEditing ? (
                <div className="card__table--line__input-container">
                    <input
                        ref={forwardRef}
                        name={name}
                        defaultValue={value}
                        className="card__table--line__input"
                        type={type}
                        onChange={onChange}
                    />
                    <small className="card__table--line__error">
                        {errorType && errorType.message}
                        {serverError}
                    </small>
                </div>
            ) : (
                <dd className="card__table--line__value">{value}</dd>
            )}
        </>
    );
};

export const TextArea = ({ isEditing, name, forwardRef, value }) => {
    return (
        <>
            {isEditing ? (
                <textarea
                    ref={forwardRef}
                    name={name}
                    defaultValue={value}
                    className="card__table--line__input textarea"
                    type="text"
                />
            ) : (
                <dd className="card__table--line__value description">
                    {value ? value : "You have no description"}
                </dd>
            )}
        </>
    );
};
