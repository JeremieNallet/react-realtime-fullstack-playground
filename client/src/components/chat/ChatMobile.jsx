import "./_ChatMobile.scss";
import React from "react";
import { Send } from "../../assets/svgs/icons";
import TextArea from "react-textarea-autosize";
import { useStore } from "../../store";
import useResponsive from "../../hooks/useResponsive";
import EmptyText from "../shared/EmptyText";
const ChatMobile = ({ children, onChange, value, onSubmit }) => {
    const pannel = useStore((state) => state.pannel);
    const setPannel = useStore((state) => state.setPannel);
    const setUser = useStore((state) => state.setUser);
    const user = useStore((state) => state.user);
    const { isMobileScreen } = useResponsive();
    const _onKeyPress = (e) => {
        const keyCode = e.key || e.which;
        if (keyCode === "Enter" || keyCode === 13) {
            e.preventDefault();
            onSubmit();
            return false;
        }
    };

    const _onSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };
    const prepareAddPosition = () => {
        setPannel("chat", false);
        setPannel("emojis", true);
        setUser("isUpdatingEmoji", false);
    };

    const conditionalDisplay = pannel.chat && !user.position && isMobileScreen;
    return (
        <div className="chat-m">
            {conditionalDisplay ? (
                <div className="chat-m__empty">
                    <span className="chat-m__empty--txt">
                        <EmptyText
                            action={prepareAddPosition}
                            text="share your position to start chatting !"
                        />
                    </span>
                </div>
            ) : (
                <div className="chat-m__messages">
                    <div className="chat-m__messages--container">{children}</div>
                </div>
            )}

            <form onSubmit={_onSubmit} className="chat-m__send-bar">
                <TextArea
                    onKeyPress={_onKeyPress}
                    onChange={onChange}
                    value={value}
                    placeholder="Type your message ..."
                    className="chat-m__send-bar--text-area"
                />
                <button type="submit" className="chat-m__send-bar--send-btn">
                    <Send />
                </button>
            </form>
        </div>
    );
};

export default ChatMobile;
