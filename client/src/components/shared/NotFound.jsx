import "./_NotFound.scss";
import React from "react";
import { useStore } from "../../store";
import { RegularBtn } from "../shared/Buttons";
import notFound from "../../assets/svgs/img/404.svg";
import { useHistory } from "react-router";

const NotFound = () => {
    const isAuth = useStore((state) => state.isAuth);
    const { push } = useHistory();
    const findMyWay = () => {
        push(`${isAuth ? "/" : "/signin"}`);
    };
    return (
        <div className="not-found">
            <div className="img-container">
                <img className="not-found__img" src={notFound} alt="404" />
            </div>
            <div className="btn-container">
                <span className="not-found__title">Hmm, there is nothing here. - 404</span>
                <RegularBtn onClick={findMyWay} arrowRight color="theme-4">
                    find my way
                </RegularBtn>
            </div>
        </div>
    );
};

export default NotFound;
