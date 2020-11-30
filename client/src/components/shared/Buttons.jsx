import "./_Buttons.scss";
import React from "react";
import { Link } from "react-router-dom";

// -> folder
import { ArrowLeft, ArrowRight, ChevrionDown } from "../../assets/svgs/icons";
import Loader from "../shared/Loader";
import Chip from "./Chip";

export const RegularBtn = ({
    className,
    link = false,
    children,
    fullWidth,
    color = "theme-1",
    spacing = 3,
    arrowRight,
    arrowLeft,
    disabled,
    active,

    ...rest
}) => {
    const Element = link ? Link : "button";
    return (
        <Element
            style={{
                width: `${fullWidth ? "100%" : "initial"}`,
                color: `${active ? "var(--color-dark-grey)" : ""}`,
                padding: `0rem ${spacing}rem`,
            }}
            className={`regular-btn ${color} ${disabled ? "disabled" : ""}`}
            {...rest}
        >
            {arrowLeft && <ArrowLeft className="regular-btn--arrow-left arrow" />}
            {children}
            {arrowRight && <ArrowRight className="regular-btn--arrow-right arrow" />}
        </Element>
    );
};
export const SquareBtn = ({
    icon,

    children,
    notification,
    className,
    disabled = false,
    background = "white",
    active,
    ...rest
}) => {
    return (
        <button
            disabled={disabled}
            style={{
                background: `var(--color-${background})`,
            }}
            className={`square-btn btn ${active ? "active" : ""} ${className}`}
            {...rest}
        >
            {icon}
            {children}
            {notification > 0 && (
                <Chip> {notification === 50 ? `${notification}+` : notification}</Chip>
            )}
        </button>
    );
};

export const LoadMoreBtn = ({ onClick, disabled, isFetchingMore, canFetchMore }) => {
    return (
        <button className="load-more-btn" onClick={onClick} disabled={disabled}>
            {isFetchingMore ? (
                <Loader size="4" />
            ) : (
                <>
                    {isFetchingMore && "loading"}
                    {canFetchMore && (
                        <>
                            load more
                            <ChevrionDown className="load-more-btn--chevron" />
                        </>
                    )}
                </>
            )}
        </button>
    );
};

export const IconBtn = ({ children, className, ...rest }) => {
    return (
        <button className={`icon-btn ${className}`} {...rest}>
            {children}
        </button>
    );
};
