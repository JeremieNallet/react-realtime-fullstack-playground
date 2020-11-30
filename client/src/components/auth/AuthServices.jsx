import "./_AuthService.scss";
import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { SERVER_URL } from "../../API";

//folder
import { useStore } from "../../store";
import { Google } from "../../assets/svgs/icons";

const AuthServices = ({ title }) => {
    const connectUser = useStore((state) => state.connectUser);
    const { push, go } = useHistory();

    const googleAccess = async ({ tokenId }) => {
        try {
            const { data } = await axios.post(`${SERVER_URL}/auth/google`, { tokenId });

            cookie.set("bn_sidxYYsjK__", data.token, { expires: 10 });
            connectUser();
            push("/");
            go(0);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-service">
            <span className="auth-service__separator">
                <span className="auth-service__separator--text">or</span>
            </span>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                render={({ onClick }) => (
                    <button onClick={onClick} className="auth-service__btn">
                        <Google className="auth-service__btn--icon" />
                        <span className="auth-service__btn--text">{title} Google</span>
                    </button>
                )}
                buttonText="Login"
                onSuccess={googleAccess}
            />
        </div>
    );
};

export default AuthServices;
