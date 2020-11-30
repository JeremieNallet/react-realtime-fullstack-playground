import "./_MenuUser.scss";
import React from "react";
import { Link } from "react-router-dom";

// => folder
import { signOutUser } from "../../API";
import { ChevronRight, Signout } from "../../assets/svgs/icons";
import { useStore } from "../../store";
import MenuLayout from "./MenuLayout";
import { useQuery } from "react-query";
import { getUserProfile } from "../../API";
// import { lobbySocket } from "../../utils/sockets";

const MenuUser = () => {
    const disconnectUser = useStore((state) => state.disconnectUser);
    const pannel = useStore((state) => state.pannel);
    // const setUser = useStore((state) => state.setUser);

    const signOut = async () => {
        signOutUser(() => disconnectUser());
        // try {
        //     await axios.delete("/userPosition/deleteMe");
        //     setUser("position", null);
        //     setUser("spot", null);
        //     setUser("emoji", null);
        //     setUser("isUpdatingEmoji", false);
        //     lobbySocket.disconnect();
        //     lobbySocket.emit("LOBBY_REMOVE_POSITION");
        // } catch (err) {
        //     console.error(err);
        // }
    };

    const { data: userProfile, status } = useQuery(
        "GET_USER_PROFILE",
        getUserProfile
    );
    return (
        <MenuLayout
            style={{ minHeight: "24rem" }}
            togglePannel={pannel.menu}
            title={status === "success" && userProfile.name}
        >
            <div className="dropdown-user">
                <ul className="dropdown-user__list">
                    <li className="dropdown-user__list--item">
                        <Link
                            className="dropdown-user__list--item__link"
                            to="/settings"
                        >
                            Account settings
                            <ChevronRight className="chevron" />
                        </Link>
                    </li>
                    <li className="dropdown-user__list--item">
                        <Link
                            className="dropdown-user__list--item__link"
                            to="/settings/security"
                        >
                            Security settings
                            <ChevronRight className="chevron" />
                        </Link>
                    </li>
                    <li className="dropdown-user__list--item">
                        <span
                            onClick={signOut}
                            className="dropdown-user__list--item__link signout"
                        >
                            <div className="container">
                                <Signout />
                                Logout
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
        </MenuLayout>
    );
};

export default MenuUser;
