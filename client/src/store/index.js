import create from "zustand";
import cookie from "js-cookie";
import localStorage from "local-storage";
import { FlyToInterpolator } from "react-map-gl";
import { easeExpOut } from "d3-ease";

const STORAGE_CHAT_VALUE = () => {
    if (localStorage.get("chat") === null) return true;
    else return localStorage.get("chat");
};

const STORAGE_SIDE_VALUE = () => {
    if (localStorage.get("side") === null) return true;
    else return localStorage.get("side");
};

export const useStore = create((set) => ({
    membershipRole: null,
    bigLoader: false,
    serverError: "",
    onGoingGroupCreation: false,
    mapLoaded: false,
    isAuth: !!cookie.get("bn_sidxYYsjK__"),
    farAwayDistance: 14,
    actionPerformed: false,

    viewPortState: {
        width: 400,
        height: 400,
        latitude: 38.5,
        longitude: -98.0,
        zoom: 12.8,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 500,
        transitionEasing: easeExpOut,
    },

    pannel: {
        group: false,
        norifications: false,
        chat: STORAGE_CHAT_VALUE(),
        side: STORAGE_SIDE_VALUE(),
        menu: false,
        userInfo: false,
        groupInfo: false,
        emojis: false,
        deviceMenu: false,
        mobileGroup: false,
        messenger: false,
    },
    user: {
        position: null,
        emoji: null,
        spot: null,
        isAddingPosition: false,
        isUpdatingEmoji: false,
        distance: 5,
        hasGroup: null,
    },
    group: {
        position: null,
        title: null,
    },

    setNextViewport: (newState) => set(() => ({ viewPortState: newState })),

    zoomIn: () =>
        set(({ viewPortState }) => ({
            viewPortState: {
                ...viewPortState,
                zoom: viewPortState.zoom + 0.5,
                transitionDuration: 500,
            },
        })),

    zoomOut: () =>
        set(({ viewPortState }) => ({
            viewPortState: {
                ...viewPortState,
                zoom: viewPortState.zoom - 0.5,
                transitionDuration: 500,
            },
        })),

    updateViewport: (newAddedValues) =>
        set(({ viewPortState }) => ({
            viewPortState: {
                ...viewPortState,
                ...newAddedValues,
                transitionDuration: 500,
            },
        })),

    setPannel: (key, val) =>
        set(({ pannel }) => ({ pannel: { ...pannel, [`${key}`]: val } })),
    setUser: (key, val) =>
        set(({ user }) => ({ user: { ...user, [`${key}`]: val } })),
    setGroup: (key, val) =>
        set(({ group }) => ({ group: { ...group, [`${key}`]: val } })),
    setMembershipRole: (memberShip) => set({ membershipRole: memberShip }),
    setBigLoader: (boolean) => set({ bigLoader: boolean }),
    setMapLoaded: () => set({ mapLoaded: true }),
    connectUser: () => set({ isAuth: true }),
    disconnectUser: () => set({ isAuth: false }),
    setServerError: (payload) => set(() => ({ serverError: payload })),
    switchIsCreatingTrue: () => set({ onGoingGroupCreation: true }),
    setActionPerformed: () => set({ actionPerformed: true }),
}));
