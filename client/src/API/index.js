import Axios from "axios";
import cookie from "js-cookie";

export const SERVER_URL =
    process.env.REACT_APP_ENV === "production"
        ? "https://www.stumbly-server.xyz/api/v1"
        : "http://localhost:8080/api/v1";

export const axios = Axios.create({
    baseURL: SERVER_URL,
});
// axios.interceptors.request.use((config) => {
//     const token = cookie.get("bn_sidxYYsjK__");
//     config.headers.Authorization = token ? `Bearer ${token}` : "";
//     return config;
// });

axios.interceptors.request.use(
    (config) => {
        const token = cookie.get("bn_sidxYYsjK__");
        config.headers.Authorization = token ? `Bearer ${token}` : "";
        return config;
    },
    async (err) => {
        const { message, error } = err.response.data;
        if (message === "jwt expired" || error.name === "TokenExpiredError") {
            cookie.remove("bn_sidxYYsjK__");
            await Axios.post(`${SERVER_URL}/auth/signout`);
            window.location.reload();
        }
        return err;
    }
);

// axios.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async ({ response: { data } }) => {
//         const { message, error } = data;
//         if (message === "jwt expired" || error.name === "TokenExpiredError") {
//             cookie.remove("bn_sidxYYsjK__");
//             await Axios.post(`${SERVER_URL}/auth/signout`);
//             window.location.reload();
//         }
//     }
// );

//CHATS
export const getGroupMessage = async (key, slug) => {
    const { data } = await axios.get(`/chats/group/${slug}`);
    return data.data;
};
export const getPrivateMessages = async (key, receiver) => {
    const { data } = await axios.get(`/chats/pm/${receiver}`);
    return data.data;
};
export const getLobbyMessages = async (key, room) => {
    const { data } = await axios.get(`/chats/lobby/${room}?sort=-createdAt`);
    return data;
};

//USERS
export const getUserProfile = async () => {
    const { data } = await axios.get("/users/profile");
    return data.data;
};

export const getPublicUser = async (_, userId) => {
    const { data } = await axios.get(`/users/public/${userId}`);
    return data.data;
};

//NOTIFICATIONS
export const getReceivedNotifications = async (key, page = 0) => {
    const { data } = await axios.get(
        `/notifications/receivedNotification?page=${page}&sort=read`
    );
    return data;
};
export const getReceivedMessages = async (key, page = 0) => {
    const { data } = await axios.get(
        `/notifications/receivedMessages?page=${page}&sort=read`
    );
    return data;
};
export const checkDocument = async (key, type, userId) => {
    const { data } = await axios.get(`/notifications/check/${type}/${userId}`);
    return data;
};

//POSITIONS
export const getOneUserPosition = async (key, userId) => {
    const { data } = await axios.get(`/userPosition/user/${userId}`);
    return data.data;
};

export const getUserPosition = async () => {
    const { data } = await axios.get("/userPosition/me");
    return data.data;
};
export const getUsersWithin = async (key, room) => {
    const { data } = await axios.get(`/userPosition/user-by-room/${room}`);
    return data;
};

//MEMBERS
export const getAllGroupMembers = async (_, groupSlug, page = 0) => {
    const { data } = await axios.get(`/members/${groupSlug}?page=${page}`);
    return data;
};
export const getOneUserMembership = async (_, groupSlug) => {
    const { data } = await axios.get(`/members/membership/${groupSlug}`);
    return data.data;
};
export const getAllUserMemberships = async (key, id, page = 0) => {
    const { data } = await axios.get(
        `/members/userMembership/${id}?page=${page}`
    );
    return data;
};
export const checkMemberExists = async (key, userId) => {
    const { data } = await axios.get(`/members/check/${userId}`);
    return data;
};
//GROUPS

export const getAllGroupsWithin = async (
    key,
    room,
    distance,
    coords,
    page = 0
) => {
    const { data } = await axios.get(
        `/groups/groups-list/${room}/${distance}/${coords}/?page=${page}&sort=-totalMembers`
    );
    return data;
};
export const getOneGroup = async (key, slug) => {
    const { data } = await axios.get(`/groups/${slug}`);
    return data;
};

export const getUserGroup = async () => {
    const { data } = await axios.get("/groups/me");
    return data.data;
};

//EXTERNAL APIS
export const getUserIpInfo = async () => {
    const { data } = await Axios.get(
        `https://api.ipstack.com/86.212.252.132?access_key=${process.env.REACT_APP_IPSTACK_KEY}`,
        null
    );
    return data;
};

export const signOutUser = async (callback) => {
    try {
        cookie.remove("bn_sidxYYsjK__");
        await Axios.post(`${SERVER_URL}/auth/signout`);
        callback();
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
};
