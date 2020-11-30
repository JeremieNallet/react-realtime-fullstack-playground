import "./_Group.scss";
import React from "react";
import { Switch, Route, useParams } from "react-router-dom";
import { useQuery } from "react-query";

// -> folders
import { getOneGroup, getOneUserMembership } from "../../API";
import { useStore } from "../../store";
import GroupNav from "./GroupNav";
import GroupMembers from "./GroupMembers";
import GroupChat from "./GroupChat";
import GroupHome from "./GroupHome";
import useResponsive from "../../hooks/useResponsive";
import Loader from "../shared/Loader";

const Group = () => {
    const { slug } = useParams();
    const { isMobileScreen } = useResponsive();
    const setMembershipRole = useStore((state) => state.setMembershipRole);

    useQuery(slug && ["GET_ONE_MEMBERSHIP", slug], getOneUserMembership, {
        onSuccess: (data) => setMembershipRole(data ? data.role : null),
    });

    const { status } = useQuery(slug && ["GET_ONE_GROUP", slug], getOneGroup);

    const routes = [
        {
            exact: true,
            path: `/group/${slug}`,
            slug: slug,
            render: () => <GroupHome slug={slug} />,
        },
        {
            path: `/group/${slug}/chat`,
            slug: slug,
            render: () => <GroupChat slug={slug} />,
        },
        {
            path: `/group/${slug}/members`,
            render: () => <GroupMembers slug={slug} />,
        },
    ];

    const __content = () => (
        <div className="group__content">
            {status === "loading" ? (
                <div className="group__loading">
                    <Loader size="8" />
                </div>
            ) : status === "error" ? (
                <div>error</div>
            ) : (
                <Switch>
                    {routes.map(({ exact, path, slug, render }, i) => (
                        <Route key={i} exact={exact} path={path} slug={slug} render={render} />
                    ))}
                </Switch>
            )}
        </div>
    );

    return (
        <>
            {isMobileScreen ? (
                <div className="group m">{__content()}</div>
            ) : (
                <div className="group">
                    <div className="group__nav">
                        <GroupNav slug={slug} />
                    </div>
                    {__content()}
                </div>
            )}
        </>
    );
};

export default Group;
