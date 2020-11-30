import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useStore } from "../../store";
const PublicRoute = ({ component: RouteComponent, ...rest }) => {
    const isAuth = useStore((state) => state.isAuth);
    return (
        <Route
            {...rest}
            render={(routeProps) => (!!isAuth ? <Redirect to={"/"} /> : <RouteComponent {...routeProps} />)}
        />
    );
};
export default PublicRoute;
