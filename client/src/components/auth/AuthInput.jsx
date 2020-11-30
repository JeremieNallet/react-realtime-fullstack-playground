import "./_AuthInput.scss";
import React from "react";

//folder
import { useStore } from "../../store";

const AuthInput = ({
    validate,
    errorType,
    title,
    type,
    name,
    placeholder,
    noMargin = true,
}) => {
    const setServerError = useStore((state) => state.setServerError);
    return (
        <div
            style={{ marginBottom: `${!noMargin ? "" : "1.4rem"}` }}
            className="auth-input"
        >
            <p className="auth-input__title">{title}</p>
            <input
                className={`auth-input__input ${
                    errorType ? "border-error" : ""
                }`}
                name={name}
                type={type}
                ref={validate}
                onChange={() => setServerError(null)}
                placeholder={placeholder}
            />
            <small className="auth-input__error">
                {errorType && errorType.message}
            </small>
        </div>
    );
};

export default AuthInput;
