import "./_MenuGroup.scss";
import React from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { useHistory } from "react-router-dom";

// => folder
import { getUserProfile, getAllUserMemberships } from "../../API";
import { LoadMoreBtn } from "../shared/Buttons";
import MenuLayout from "./MenuLayout";
import { useStore } from "../../store";
import CardGroupMenu from "../card/CardGroupMenu";
import { truncate } from "lodash";
import Loader from "../shared/Loader";

const MenuGroup = ({ styles }) => {
    const { data: userProfile } = useQuery("GET_USER_PROFILE", getUserProfile);
    const switchIsCreatingTrue = useStore((state) => state.switchIsCreatingTrue);
    const setPannel = useStore((state) => state.setPannel);
    const pannel = useStore((state) => state.pannel);
    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
    } = useInfiniteQuery(
        userProfile && ["USER_ALL_USER_MEMBERSHIP", userProfile._id],
        userProfile && getAllUserMemberships,
        { getFetchMore: (lastGroup, allGroups) => lastGroup.nextPage }
    );

    const { push } = useHistory();

    const createNewGroup = () => {
        push("/create");
        switchIsCreatingTrue();
        setPannel("group", false);
    };

    return (
        <>
            <MenuLayout togglePannel={pannel.group} title="Groups">
                <>
                    {status === "loading" ? (
                        <Loader /> ? (
                            status === "error"
                        ) : (
                            <div>error</div>
                        )
                    ) : (
                        <>
                            {userProfile && !userProfile.hasGroup && (
                                <CardGroupMenu create onClick={createNewGroup} />
                            )}
                            {data[0].count > 0 ? (
                                <>
                                    {data.map((group, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                {group.data.map((membership) => (
                                                    <React.Fragment key={membership._id}>
                                                        {membership.role === "admin" && (
                                                            <CardGroupMenu
                                                                admin
                                                                img={membership.groupInfo.img}
                                                                title={truncate(
                                                                    membership.groupInfo.title,
                                                                    {
                                                                        length: 20,
                                                                    }
                                                                )}
                                                                onClick={() =>
                                                                    push(
                                                                        `/group/${membership.groupInfo.slug}`
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                        {membership.role === "member" && (
                                                            <CardGroupMenu
                                                                img={membership.groupInfo.img}
                                                                member
                                                                title={truncate(
                                                                    membership.groupInfo.title,
                                                                    {
                                                                        length: 20,
                                                                    }
                                                                )}
                                                                onClick={() =>
                                                                    push(
                                                                        `/group/${membership.groupInfo.slug}`
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                    {canFetchMore && (
                                        <LoadMoreBtn
                                            onClick={() => fetchMore()}
                                            disabled={!canFetchMore || isFetchingMore}
                                            isFetchingMore={isFetchingMore}
                                            canFetchMore={canFetchMore}
                                        />
                                    )}
                                </>
                            ) : null}
                        </>
                    )}
                </>
            </MenuLayout>
        </>
    );
};

export default MenuGroup;
