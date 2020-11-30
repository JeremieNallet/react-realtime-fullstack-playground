import "./_CardSettings.scss";
import React from "react";

const CardSettings = ({ onClick, title, sideTitle, children, help }) => {
    return (
        <div className="c-settings">
            <div className="c-settings__head">
                <span className="c-settings__head--title">{title}</span>
                {onClick && (
                    <span className="c-settings__head--side-text" onClick={onClick}>
                        {sideTitle}
                    </span>
                )}
            </div>
            <div className="c-settings__content">{children}</div>
            <span className="c-settings__help">{help}</span>
        </div>
    );
};

export default CardSettings;
