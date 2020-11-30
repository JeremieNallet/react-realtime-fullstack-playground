import "./_Settings.scss";
import React from "react";
import { Route, Switch } from "react-router-dom";

// => foldler
import SettingsNav from "./SettingsNav";
import SettingsAccount from "./SettingsAccount";
import SettingsSecurity from "./SettingsSecurity";
import useResponsive from "../../hooks/useResponsive";
import { getUserProfile } from "../../API";
import { useQuery } from "react-query";
import Loader from "../shared/Loader";

const Settings = () => {
    const { isMobileScreen } = useResponsive();
    const { status } = useQuery("GET_USER_PROFILE", getUserProfile);

    return (
        <div className={`settings ${isMobileScreen ? "m" : ""}`}>
            {status === "loading" ? (
                <div className="settings__loading">
                    <Loader size="8" />
                </div>
            ) : status === "error" ? (
                <div>error</div>
            ) : (
                <>
                    {!isMobileScreen && (
                        <div className="settings__side">
                            <SettingsNav />
                        </div>
                    )}
                    <div className="settings__content">
                        <Switch>
                            <Route exact path="/settings" component={SettingsAccount} />
                            <Route path="/settings/security" component={SettingsSecurity} />
                        </Switch>
                    </div>
                </>
            )}
        </div>
    );
};

export default Settings;
