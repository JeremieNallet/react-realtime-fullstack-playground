import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { SERVER_URL } from "../../API";

// => folders
import { validateSignIn } from "../../utils/validations";
import { RegularBtn } from "../shared/Buttons";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";

const SignInForm = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const { register, errors, handleSubmit } = useForm();

    const sendResetLink = async ({ email }) => {
        setEmailSent(true);
        setEmail(email);
        try {
            await axios.post(`${SERVER_URL}/auth/forgotpassword`, { email });
        } catch ({ response }) {
            if (response.status === 404) {
                console.clear();
                return;
            }
        }
    };

    return (
        <>
            {!emailSent ? (
                <AuthLayout onSubmit={handleSubmit(sendResetLink)} redirect="/signin">
                    <AuthInput
                        type="text"
                        name="email"
                        placeholder="you@domain.com"
                        errorType={errors.email}
                        title="Enter your email adress"
                        validate={register(validateSignIn.email)}
                    />

                    <RegularBtn fullWidth arrowRight color="theme-4">
                        Send reset instructions
                    </RegularBtn>
                </AuthLayout>
            ) : (
                <AuthLayout redirect="/signin">
                    <p className="auth-forgot-pw">
                        If we found an account associated to {email} we've sent a link for you to
                        modify your password. Be sure to check your spam folder.{" "}
                    </p>
                </AuthLayout>
            )}
        </>
    );
};

export default SignInForm;
