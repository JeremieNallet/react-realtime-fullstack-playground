import "./_AuthSingin.scss";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import cookie from "js-cookie";

// => folders
import { validateSignIn } from "../../utils/validations";
import { useStore } from "../../store";
import { Link } from "react-router-dom";
import { RegularBtn } from "../shared/Buttons";
import AuthInput from "./AuthInput";
import AuthLayout from "./AuthLayout";
import { SERVER_URL } from "../../API";

const AuthSignin = () => {
    const { register, errors, handleSubmit } = useForm();

    const connectUser = useStore((state) => state.connectUser);
    const setServerError = useStore((state) => state.setServerError);
    const setBigLoader = useStore((state) => state.setBigLoader);

    const login = async (cred) => {
        setBigLoader(true);
        try {
            const { data } = await axios.post(`${SERVER_URL}/auth/login`, cred);
            cookie.set("bn_sidxYYsjK__", data.token, { expires: 10 });
            setBigLoader(false);
            connectUser();
        } catch (err) {
            console.log(err.response);
            setServerError(err.response.data.message);
            setBigLoader(false);
        }
    };

    return (
        <AuthLayout
            redirect="/signup"
            authServices
            title="Continue with"
            onSubmit={handleSubmit(login)}
        >
            <AuthInput
                type="text"
                name="email"
                placeholder="you@mail.com"
                errorType={errors.email}
                title="Email address"
                validate={register(validateSignIn.email)}
            />
            <AuthInput
                noMargin={false}
                type="password"
                name="password"
                placeholder="••••••••"
                errorType={errors.password}
                title="Password"
                validate={register(validateSignIn.password)}
            />
            <div className="auth-input">
                <input
                    id="username"
                    tabIndex="-1"
                    autoComplete="off"
                    placeholder="Your name here"
                    className="username"
                    ref={register({ validate: (value) => value === "" })}
                    name="username"
                />
            </div>

            <div className="forgot-pw">
                <Link className="forgot-pw--link" to="/forgot_pw">
                    Forgot your password ?
                </Link>
            </div>

            <RegularBtn fullWidth arrowRight color="theme-1">
                continue
            </RegularBtn>
        </AuthLayout>
    );
};

export default AuthSignin;
