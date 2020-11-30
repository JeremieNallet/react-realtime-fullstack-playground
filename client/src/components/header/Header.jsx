import "./_Header.scss";
import React from "react";

// => folder
import { useStore } from "../../store";
import HeaderMenus from "./HeaderMenus";
import HeaderLogo from "./HeaderLogo";

const Header = () => {
    const isBigSearchOpen = useStore((state) => state.isBigSearchOpen);
    const isAuth = useStore((state) => state.isAuth);
    const user = useStore((state) => state.user);
    return (
        <>
            {!isBigSearchOpen && isAuth && (
                <nav className={`header ${user.isAddingPosition ? "adding-pos" : ""}`}>
                    <HeaderLogo />
                    <HeaderMenus />
                </nav>
            )}
        </>
    );
};

export default Header;
