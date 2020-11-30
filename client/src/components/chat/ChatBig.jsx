import "./_ChatBig.scss";
import React, { useState, useRef } from "react";

//folder
import TextArea from "react-textarea-autosize";
import { Emoji, Send } from "../../assets/svgs/icons";

import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import useClickOutside from "use-onclickoutside";

const ChatBig = ({ onSubmit, children, onChange, value, pickerCallback }) => {
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const pickerRef = useRef();
    useClickOutside(pickerRef, () => setIsEmojiOpen(false));

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
    const onEmojiSelect = ({ native: emoji }) => {
        pickerCallback(emoji);
        setIsEmojiOpen(false);
    };
    return (
        <div className="chat-big">
            <div className="chat-big__top">
                <div className="container">{children}</div>
            </div>
            <form onSubmit={_onSubmit} ref={pickerRef} className="chat-big__bot">
                {isEmojiOpen && (
                    <div className="emoji-picker">
                        <Picker onSelect={onEmojiSelect} />
                    </div>
                )}

                <div className="container">
                    <TextArea
                        onKeyPress={_onKeyPress}
                        onChange={onChange}
                        value={value}
                        placeholder="Type your message ..."
                        className="textarea"
                    />
                    <button
                        ref={pickerRef}
                        onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                        className="emoji-btn"
                    >
                        <Emoji />
                    </button>
                </div>
                <button type="submit" className="send-btn">
                    <Send />
                </button>
            </form>
        </div>
    );
};

export default ChatBig;
