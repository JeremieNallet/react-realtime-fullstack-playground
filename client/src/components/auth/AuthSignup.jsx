import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import cookie from "js-cookie";

// => folders
import { validateSignUp } from "../../utils/validations";
import { useStore } from "../../store";
import { RegularBtn } from "../shared/Buttons";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import { SERVER_URL } from "../../API";

const AuthSignin = () => {
    const { register, errors, handleSubmit } = useForm();
    const setBigLoader = useStore((state) => state.setBigLoader);
    const setServerError = useStore((state) => state.setServerError);
    const connectUser = useStore((state) => state.connectUser);

    const signUp = async (cred) => {
        setBigLoader(true);
        try {
            const { data } = await axios.post(
                `${SERVER_URL}/auth/signup`,
                cred
            );
            cookie.set("bn_sidxYYsjK__", data.token, { expires: 10 });
            connectUser();
            setBigLoader(false);
        } catch (err) {
            setServerError(err.response.data.message || err.response.data);
            setBigLoader(false);
        }
    };

    return (
        <AuthLayout
            authServices
            title="sign up with"
            onSubmit={handleSubmit((cred) => signUp(cred))}
            redirect="/signin"
        >
            <AuthInput
                placeholder="John Doe"
                name="name"
                type="text"
                errorType={errors.name}
                title="Choose a name"
                validate={register(validateSignUp.name)}
            />
            <AuthInput
                type="text"
                name="email"
                errorType={errors.email}
                title="Your email address"
                placeholder="you@mail.com"
                validate={register(validateSignUp.email)}
            />
            <AuthInput
                name="password"
                type="password"
                errorType={errors.password}
                title="Choose a password"
                placeholder="••••••••"
                validate={register(validateSignUp.password)}
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

            <RegularBtn fullWidth arrowRight color="theme-1">
                continue
            </RegularBtn>
        </AuthLayout>
    );
};

export default AuthSignin;
