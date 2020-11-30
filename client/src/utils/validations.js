export const validateSignUp = {
    name: {
        required: "",
        pattern: {
            value: /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u,
            message: "Please enter a valid name.",
        },
    },
    email: {
        required: " ",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "invalid email address.",
        },
    },
    password: {
        required: " ",
        minLength: {
            value: 8,
            message: "Password must have at least 8 characters.",
        },
    },
    confirmPassword: "The passwords do not match.",
};

export const validateSignIn = {
    email: {
        required: " ",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "invalid email address.",
        },
    },
    password: {
        required: " ",
        minLength: {
            value: 8,
            message: "Password must have at least 8 characters.",
        },
    },
};

export const validateUserInfo = {
    name: {
        required: "Field cannot be empty.",
        pattern: {
            value: /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u,
            message: "Please enter a valid name.",
        },
    },
    email: {
        required: "Field cannot be empty.",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Please enter a valid email address.",
        },
    },

    password: {
        required: "Choose a password.",
        minLength: {
            value: 8,
            message: "Password must have at least 8 characters.",
        },
    },
    confirmPassword: "The passwords do not match.",
    description: {},
};
