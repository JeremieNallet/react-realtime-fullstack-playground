import "./_AuthLayout.scss";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

//  folders
import { useStore } from "../../store";
import AuthServices from "./AuthServices";
import logo from "../../assets/svgs/logo.svg";

const AuthLayout = ({
    children,
    onSubmit,
    authServices = false,
    redirect,
    title,
}) => {
    const setServerError = useStore((state) => state.setServerError);
    useEffect(() => {
        setServerError(null);
    }, [setServerError]);

    return (
        <div className="auth-layout">
            <div className="container">
                <h3 className="auth-layout__header">
                    <img
                        className="auth-layout__header--logo"
                        src={logo}
                        alt="logo"
                    />
                    <span className="auth-layout__header--txt">stumbly.io</span>
                </h3>
                <div className="auth-layout__content">
                    <form
                        className="auth-layout__content--form"
                        onSubmit={onSubmit}
                    >
                        {children}
                    </form>
                    {authServices && <AuthServices title={title} />}
                </div>

                <span className="auth-layout__redirect">
                    {redirect === "/signin"
                        ? "Already have an account ?"
                        : " Doesn't have an account ? "}{" "}
                    <Link to={redirect} className="highlight">
                        {redirect === "/signin" ? "log in !" : "sign up !"}
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default AuthLayout;
