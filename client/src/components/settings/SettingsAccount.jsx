import "./_SettingsAccount.scss";
import React from "react";
import Infos from "./Infos";
import Bio from "./Bio";
import Password from "./Password";
import useResponsive from "../../hooks/useResponsive";
import { useStore } from "../../store";
import { signOutUser } from "../../API";
import { RegularBtn } from "../shared/Buttons";
const SettingsAccount = () => {
    const { isMobileScreen } = useResponsive();
    const disconnectUser = useStore((state) => state.disconnectUser);
    const signOut = () => {
        signOutUser(() => disconnectUser());
    };
    return (
        <>
            <Bio isMobileScreen={isMobileScreen} />
            <Infos isMobileScreen={isMobileScreen} />
            <Password />
            {isMobileScreen && (
                <RegularBtn
                    fullWidth
                    color="theme-2"
                    onClick={signOut}
                >
                    log out
                </RegularBtn>
            )}
        </>
    );
};

export default SettingsAccount;
