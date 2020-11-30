import "./_GroupMembers.scss";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { axios } from "../../API";
import { timeFromNow } from "../../utils/dates";

// -> folder
import { getAllGroupMembers } from "../../API";
import { useStore } from "../../store";

import CardGroupMember from "../card/CardGroupMember";
import useResponsive from "../../hooks/useResponsive";
import ModalConfirm from "../modals/ModalConfirm";
import { Loader } from "../shared/Loader";
import { LoadMoreBtn } from "../shared/Buttons";

const GroupMembers = ({ slug }) => {
    const [isDeleting, setIsDeleting] = useState({ pannel: false, id: null });
    const membershipRole = useStore((state) => state.membershipRole);

    const { isMobileScreen } = useResponsive();

    const renderStatus = (id) => {
        if (membershipRole === "admin") {
            return (
                <button onClick={() => setIsDeleting({ pannel: true, id })}>
                    remove user
                </button>
            );
        } else {
            return "member";
        }
    };
    const {
        status,
        data: members,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        refetch,
    } = useInfiniteQuery(
        slug && ["GET_ALL_GROUP_MEMBERS", slug],
        getAllGroupMembers,
        {
            getFetchMore: (lastGroup) => lastGroup.nextPage,
        }
    );

    const removeUser = async () => {
        try {
            await axios.delete(`/members/kick/${isDeleting.id}/${slug}`);
            refetch();
            setIsDeleting({ pannel: false, id: null });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {isDeleting.pannel && (
                <ModalConfirm
                    onConfirm={removeUser}
                    onCancel={() => setIsDeleting({ pannel: false })}
                    text="This action will remove the member from the group"
                />
            )}
            <div className={`group-members ${isMobileScreen ? "m" : ""} `}>
                {status === "loading" ? (
                    <div className="group-members__loading">
                        <Loader size="8" />
                    </div>
                ) : status === "error" ? (
                    <div>error</div>
                ) : (
                    <>
                        <div className="group-members__title">
                            Members {members[0].count}
                        </div>
                        <div className="group-members__user-list">
                            {members.map((member, i) => (
                                <React.Fragment key={i}>
                                    {member.data.map((el) => (
                                        <React.Fragment key={el._id}>
                                            {el.role !== "admin" ? (
                                                <CardGroupMember
                                                    bio={
                                                        el.user.description ||
                                                        "This user has no bio."
                                                    }
                                                    status={renderStatus(
                                                        el._id
                                                    )}
                                                    img={el.user.photo}
                                                    name={el.user.name}
                                                    tsp={`Joined ${timeFromNow(
                                                        el.createdAt
                                                    )}`}
                                                />
                                            ) : (
                                                <CardGroupMember
                                                    admin
                                                    key={el._id}
                                                    bio={
                                                        el.user.description ||
                                                        "This user has no bio."
                                                    }
                                                    status="Group leader"
                                                    img={el.user.photo}
                                                    name={el.user.name}
                                                    tsp={`Created ${timeFromNow(
                                                        el.createdAt
                                                    )}`}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                            <div className="group-members__load-btn">
                                {canFetchMore && members[0].count !== 0 && (
                                    <LoadMoreBtn
                                        onClick={() => fetchMore()}
                                        disabled={
                                            !canFetchMore || isFetchingMore
                                        }
                                        isFetchingMore={isFetchingMore}
                                        canFetchMore={canFetchMore}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GroupMembers;
