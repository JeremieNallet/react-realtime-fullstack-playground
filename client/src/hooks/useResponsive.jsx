import { useState, useLayoutEffect } from "react";

const useResponsive = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [isMobileScreen, setIsMobileScreen] = useState(false);

    useLayoutEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        setIsMobileScreen(width < 865);

        return () => window.removeEventListener("resize", handleResize);
    }, [width]);
    return { isMobileScreen };
};

export default useResponsive;
