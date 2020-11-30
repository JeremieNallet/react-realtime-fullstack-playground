import "./_CardGlobal.scss";
import React, { useRef, useState } from "react";
import useOnClickOutside from "use-onclickoutside";

// -> folder
import { ThreeDots, Cross, ArrowRight } from "../../assets/svgs/icons";
import UserImg from "../shared/UserImg";
import { IconBtn } from "../shared/Buttons";
import { truncate } from "lodash";

const CardGlobal = ({
    title,
    text,
    img,
    name,
    action,
    userImg,
    read,
    tsp,
    actionText,
    primaryMenuAction,
    primaryTextAction,
    secondaryMenuAction,
    secondaryTextAction,
    onClick,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const Icon = !menuOpen ? ThreeDots : Cross;
    useOnClickOutside(menuRef, () => setMenuOpen(false));
    const _action = (e) => {
        e.stopPropagation();
        action();
    };
    const _primaryAction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        primaryMenuAction();
        setMenuOpen(false);
    };
    const _secondaryMenuAction = (e) => {
        e.stopPropagation();
        secondaryMenuAction();
        setMenuOpen(false);
    };
    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };
    return (
        <div onClick={onClick} className={`c-global ${read ? "read" : ""}`}>
            <div className={`container  ${menuOpen ? "menu-open" : ""}`}>
                <div className="c-global__img">
                    {img ? (
                        <img className="c-global__img--svg" src={img} alt="svg" />
                    ) : (
                        <UserImg img={userImg} name={name} />
                    )}
                </div>
                <div className="c-global__text">
                    <span className="c-global__text--title">{title}</span>
                    <p className="c-global__text--para">{truncate(text, { length: 60 })}</p>
                    {actionText && (
                        <span onClick={_action} className="c-global__text--action">
                            {actionText}
                            <ArrowRight />
                        </span>
                    )}
                </div>

                <IconBtn onClick={toggleMenu} className="c-global__btn">
                    <Icon />
                </IconBtn>
            </div>
            {menuOpen && (
                <ul className="c-global__menu">
                    {primaryTextAction && (
                        <li onClick={_primaryAction} className="c-global__menu--item">
                            {primaryTextAction}
                        </li>
                    )}
                    {secondaryTextAction && (
                        <li onClick={_secondaryMenuAction} className="c-global__menu--item">
                            {secondaryTextAction}
                        </li>
                    )}
                </ul>
            )}

            {!menuOpen && <div className="c-global__tsp">{tsp}</div>}
        </div>
    );
};

export default CardGlobal;
