import "./global.scss";
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import cookie from "js-cookie";
import { ReactQueryDevtools } from "react-query-devtools";

// folders
import { useStore } from "./store";
import { axios, getUserProfile, signOutUser } from "./API";
import BigLoader from "./components/shared/BigLoader";
import useResponsive from "./hooks/useResponsive";
import MobileLayout from "./components/shared/MobileLayout";
import DesktopLayout from "./components/shared/DesktopLayout";
import ServerError from "./components/shared/ServerError";

// routes
import AuthForgotPw from "./components/auth/AuthForgotPw";
import AuthSignin from "./components/auth/AuthSignIn";
import AuthSignup from "./components/auth/AuthSignup";
import AuthResetPw from "./components/auth/AuthResetPw";
import Dashboard from "./components/dashboard/Dashboard";
import Creator from "./components/creator/Creator";
import Settings from "./components/settings/Settings";
import Messenger from "./components/messenger/Messenger";
import Group from "./components/group/Group";
import ChatBig from "./components/chat/ChatBig";
import MenuGroup from "./components/menu/MenuGroup";
import MenuNotification from "./components/menu/MenuNotification";
import PrivateRoute from "./components/shared/PrivateRoute";
import PublicRoute from "./components/shared/PublicRoute";
import NotFound from "./components/shared/NotFound";
import { isMobile } from "react-device-detect";
import ServerLost from "./components/shared/ServerLost";
import { lobbySocket, messengerSocket, socket } from "./utils/sockets";
import useClosePannelsOnRouteChange from "./hooks/useClosePannelsOnRouteChange";

const App = () => {
    const [serverLost, setServerLost] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const bigLoader = useStore((state) => state.bigLoader);
    const disconnectUser = useStore((state) => state.disconnectUser);
    const isAuth = useStore((state) => state.isAuth);
    const setUser = useStore((state) => state.setUser);
    const viewPortState = useStore((state) => state.viewPortState);
    console.log(viewPortState);
    const { isMobileScreen } = useResponsive();

    useClosePannelsOnRouteChange("chat", "side")

    useQuery(
        "GET_USER_PROFILE",
        isAuth && getUserProfile, {
        onSuccess: (data) => {
            messengerSocket.emit("MESSENGER_JOIN", { userID: data._id })
        },
        onError: () => socket.on("disconnect", () => {
            disconnectUser();
            signOutUser();
        })
    }
    );

    const clearLoaderIsClientHasLoaded = useCallback(() => {
        const loader = document.querySelector(".preloader");
        loader.classList.remove("preloader");
        loader.classList.add("loader-hide");
    }, [])

    const logoutIfJWTisGone = useCallback(() => {
        const token = cookie.get("bn_sidxYYsjK__");
        (async () => {
            if (isAuth && !token) {
                const { status } = await axios.delete("/userPosition/deleteMe");
                if (status === 200) {
                    setUser("position", null);
                    setUser("spot", null);
                    setUser("emoji", null);
                    setUser("isUpdatingEmoji", false);
                    lobbySocket.disconnect();
                    lobbySocket.emit("LOBBY_REMOVE_POSITION");
                }
            }
        })()
    }, [isAuth, setUser])


    const setCssVariableForMobileHeight = useCallback(() => {
        if (isMobile) {
            const storeCssVarHeight = () => {
                document.documentElement.style.setProperty(
                    "--vh",
                    `${window.innerHeight * 0.01}px`
                );
            };
            window.addEventListener("resize", storeCssVarHeight);
            window.addEventListener("orientationchange", storeCssVarHeight);
            storeCssVarHeight();
            return () => {
                window.removeEventListener("resize", storeCssVarHeight);
                window.removeEventListener(
                    "orientationchange",
                    storeCssVarHeight
                );
            };
        }

    }, [])


    const pushToDesktopView = useCallback(() => {
        if (location.pathname[1] === "m" && !isMobileScreen) {
            history.push("/");
        }
    }, [history, isMobileScreen, location.pathname])

    useEffect(() => {
        logoutIfJWTisGone()
    }, [logoutIfJWTisGone]);

    useEffect(() => {
        socket.on("disconnect", () => setServerLost(true));
    }, [])

    useLayoutEffect(() => {
        clearLoaderIsClientHasLoaded()
    }, [clearLoaderIsClientHasLoaded])

    useEffect(() => {
        pushToDesktopView()
    }, [pushToDesktopView]);

    useEffect(() => {
        setCssVariableForMobileHeight()
    }, [setCssVariableForMobileHeight]);

    const Layout = isMobileScreen && isAuth ? MobileLayout : DesktopLayout;
    return (
        <>
            {bigLoader && <BigLoader />}
            <ServerError />
            <Layout>
                {serverLost && isAuth && <ServerLost />}
                <Switch>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <PrivateRoute path="/create" component={Creator} />
                    <PrivateRoute path="/group/:slug" component={Group} />
                    <PrivateRoute path="/pm" component={Messenger} />
                    <PrivateRoute path="/chat" component={ChatBig} />
                    <PublicRoute path="/signin" component={AuthSignin} />
                    <PublicRoute path="/signup" component={AuthSignup} />
                    <PublicRoute path="/forgot_pw" component={AuthForgotPw} />
                    <PublicRoute path="/reset/:token" component={AuthResetPw} />
                    <PrivateRoute path="/m/groups" component={MenuGroup} />
                    <PrivateRoute path="/m/noti" component={MenuNotification} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
            {process.env.REACT_APP_ENV && <ReactQueryDevtools initialIsOpen={false} />}
        </>
    );
};

export default App;
