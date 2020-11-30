import React from "react";
import Delete from "./Delete";
import useResponsive from "../../hooks/useResponsive";

const SettingsSecurity = () => {
    const { isMobileScreen } = useResponsive();
    return <Delete isMobileScreen={isMobileScreen} />;
};

export default SettingsSecurity;
