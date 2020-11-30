import "./_ChatFloating.scss";
import React, { useState, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import TextArea from "react-textarea-autosize";

// -> folder
import { ArrowDiag, Emoji, Send, Minimize, Square } from "../../assets/svgs/icons";
import { useStore } from "../../store";
import localStorage from "local-storage";
import EmptyText from "../shared/EmptyText";
import useClickOutside from "use-onclickoutside";

const ChatFloating = ({ pickerCallback, onChange, value, children, onSubmit, countUsers }) => {
    const [isBigger, setIsBigger] = useState(false);
    const [emojiOpen, setIsEmojiOpen] = useState(false);
    const setPannel = useStore((state) => state.setPannel);
    const user = useStore((state) => state.user);
    const pickerRef = useRef();
    const Icon = isBigger ? Minimize : Square;

    useClickOutside(pickerRef, () => setIsEmojiOpen(false));

    const closeChatPannel = () => {
        setPannel("chat", false);
        localStorage.set("chat", false);
    };

    const prepareAddPosition = () => {
        setPannel("chat", false);
        setPannel("emojis", true);
    };

    const makeWindowBigger = () => setIsBigger(!isBigger);

    const _onKeyPress = (e) => {
        const keyCode = e.key || e.which || e.code;
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
    const onEmojiSelect = (e) => {
        pickerCallback(e.native);
        setIsEmojiOpen(false);
    };

    return (
        <>
            <div
                ref={pickerRef}
                style={{
                    width: `${isBigger ? "calc(100% - 15rem)" : "50rem"}`,
                    height: `${isBigger ? "calc(100% - 15rem)" : "48rem"}`,
                }}
                className="chat-floating"
            >
                {emojiOpen && (
                    <div className="chat-floating__emoji-picker">
                        <Picker onSelect={onEmojiSelect} />
                    </div>
                )}
                <div className="chat-floating__messages">
                    <div className="chat-floating__messages--header">
                        <span className="chat-floating__messages--header__online">
                            <div
                                style={{
                                    background: `${
                                        !user.position
                                            ? "var(--color-theme-2"
                                            : "var(--color-theme-3)"
                                    }`,
                                }}
                                className="dot"
                            />
                            {user.position ? (
                                <span className="text">
                                    {countUsers} user{countUsers > 1 ? "s" : ""} in {user.spot}
                                </span>
                            ) : (
                                <span className="text">offline</span>
                            )}
                        </span>

                        <div className="chat-floating__messages--header__btns">
                            <button onClick={closeChatPannel}>
                                <ArrowDiag />
                            </button>
                            <button onClick={makeWindowBigger}>
                                <Icon />
                            </button>
                        </div>
                    </div>

                    {user.position ? (
                        <div className="chat-floating__messages--container">{children}</div>
                    ) : (
                        <div className="chat-floating__messages--no-pos">
                            <EmptyText
                                action={prepareAddPosition}
                                text="share your posittion to start chatting !"
                            />
                        </div>
                    )}
                </div>
                {user.position && (
                    <form onSubmit={_onSubmit} className="chat-floating__form">
                        <div className="chat-floating__form--container">
                            <button
                                onClick={() => setIsEmojiOpen(!emojiOpen)}
                                className="chat-floating__form--btn"
                            >
                                <Emoji className="chat-floating__form--btn__icon-emoji" />
                            </button>
                            <TextArea
                                onKeyPress={_onKeyPress}
                                onChange={onChange}
                                value={value}
                                placeholder="Type your message ..."
                                className="chat-floating__form--textarea"
                            />

                            <button type="submit" className="chat-floating__form--btn">
                                <Send className="chat-floating__form--btn__icon-send" />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default ChatFloating;
