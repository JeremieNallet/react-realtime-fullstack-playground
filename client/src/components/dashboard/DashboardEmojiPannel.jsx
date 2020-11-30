import "./_DashboardEmojiPannel.scss";
import React from "react";
import { axios } from "../../API";

//folders
import emojis from "../../assets/svgs/emojis";
import { useStore } from "../../store";

import { Cross } from "../../assets/svgs/icons";
import localStorage from "local-storage";
import { IconBtn } from "../shared/Buttons";

const DashboardEmojiPannel = () => {
    const pannel = useStore((state) => state.pannel);
    const setBigLoader = useStore((state) => state.setBigLoader);
    const setPannel = useStore((state) => state.setPannel);
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    const selectEmoji = async (emoji) => {
        if (!user.isUpdatingEmoji) {
            setPannel("chat", false);
            localStorage.set("chat", false);
            setUser("emoji", emoji);
            setUser("isAddingPosition", true);
            setPannel("emojis", false);
        }
        if (user.isUpdatingEmoji) {
            setBigLoader(true);
            try {
                const { status } = await axios.patch("/users/updateProfile", {
                    mood: emoji,
                });
                if (status === 200) {
                    setTimeout(() => setBigLoader(false), 800);
                    setUser("emoji", emoji);
                    setPannel("emojis", false);
                }
            } catch (err) {
                setPannel("emojis", false);
                setTimeout(() => setBigLoader(false), 800);
                console.error(err);
            }
        }
    };

    return (
        <>
            {pannel.emojis && (
                <div className="position-pannel">
                    <div className="position-pannel__container">
                        <IconBtn
                            onClick={() => setPannel("emojis", false)}
                            className="close-pannel"
                        >
                            <Cross />
                        </IconBtn>

                        <div className="position-pannel__container--header">
                            <span>
                                {user.isUpdatingEmoji ? "Change my mood" : "What mood are you in ?"}
                            </span>
                        </div>
                        <div className="position-pannel__container--emojis">
                            {emojis.map((el, i) => (
                                <img
                                    onClick={() => selectEmoji(el.emoji)}
                                    key={i}
                                    src={el.emoji}
                                    alt="emoji"
                                />
                            ))}
                        </div>
                        <p className="position-pannel__container--help">
                            {user.isUpdatingEmoji
                                ? "Select an emoji to update your mood."
                                : "Select an emoji and place it anywhere."}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardEmojiPannel;
