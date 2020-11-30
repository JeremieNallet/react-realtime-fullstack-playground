import "./_ModalConfirm.scss";
import React from "react";

//folder
import { RegularBtn } from "../shared/Buttons";

const ModalConfirm = ({ text, onConfirm, onCancel }) => {
    return (
        <div className="modal-confirm">
            <div className="container">
                <div className="modal-confirm__head">
                    <span className="modal-confirm__head--title">Are you sure ?</span>
                </div>
                <span className="modal-confirm__msg">{text}</span>
                <div className="modal-confirm__btns">
                    <RegularBtn spacing="4.4" onClick={onCancel} color="theme-4">
                        cancel
                    </RegularBtn>
                    <RegularBtn spacing="4" onClick={onConfirm} color="theme-1">
                        comfirm
                    </RegularBtn>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
