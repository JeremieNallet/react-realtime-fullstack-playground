import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";

// => folders
import { validateSignUp } from "../../utils/validations";
import { RegularBtn } from "../shared/Buttons";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import { SERVER_URL } from "../../API";

const SignUpForm = () => {
    const { token } = useParams();
    const password = useRef();
    const { register, handleSubmit, watch, errors } = useForm();
    password.current = watch("password", "");

    const verifyPasswords = () => {
        return {
            validate: (typed) => typed === password.current || validateSignUp.confirmPassword,
        };
    };

    const resetPassword = async (cred) => {
        await axios.patch(`${SERVER_URL}/auth/resetpassword/${token}`, {
            password: cred.password,
            confirmPassword: cred.confirmPassword,
        });
    };

    return (
        <AuthLayout onSubmit={handleSubmit((cred) => resetPassword(cred))}>
            <AuthInput
                name="password"
                type="password"
                errorType={errors.password}
                title="New password"
                placeholder="********"
                validate={register(validateSignUp.password)}
            />
            <AuthInput
                name="confirmPassword"
                type="password"
                errorType={errors.confirmPassword}
                title="Confirm new password"
                placeholder="********"
                validate={register(verifyPasswords())}
            />

            <RegularBtn fullWidth arrowRight color="theme-1">
                Reset password
            </RegularBtn>
        </AuthLayout>
    );
};

export default SignUpForm;
