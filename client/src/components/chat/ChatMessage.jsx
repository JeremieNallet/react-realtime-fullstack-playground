import "./_ChatMessage.scss";
import React, { useRef, useState } from "react";

//folder
import UserImg from "../shared/UserImg";
import useResponsive from "../../hooks/useResponsive";
import useClickOutside from "use-onclickoutside";

const ChatMessage = ({ type, text, tsp, img, emoji, menuAction, name }) => {
    const { isMobileScreen } = useResponsive();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef();
    useClickOutside(menuRef, () => setIsMenuOpen(false));

    return (
        <div className={`chat-message ${type} ${isMobileScreen ? "m" : ""}`}>
            {type !== "user" && (
                <>
                    {!emoji ? (
                        <UserImg className="chat-message__img" name={name} size="5" img={img} />
                    ) : (
                        <img
                            onClick={() => setIsMenuOpen(true)}
                            alt="user"
                            className="chat-message__emoji"
                            src={emoji}
                        />
                    )}
                </>
            )}
            <div className="chat-message__bubble">
                <p className="chat-message__bubble--text">{text}</p>
                <small className="chat-message__bubble--tsp">{tsp}</small>
            </div>
            {isMenuOpen && (
                <button
                    ref={menuRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        menuAction();
                        setIsMenuOpen(false);
                    }}
                    className="chat-message__find"
                >
                    find user
                </button>
            )}
        </div>
    );
};

export default ChatMessage;
