import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useStore } from "../../store";
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const isAuth = useStore((state) => state.isAuth);
    return (
        <Route
            {...rest}
            render={(routeProps) =>
                !!isAuth ? <RouteComponent {...routeProps} /> : <Redirect to={"/signin"} />
            }
        />
    );
};

export default PrivateRoute;
