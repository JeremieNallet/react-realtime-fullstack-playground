export const combineStatus = (args) => {
    let status = null;
    const success = args.every((el) => el === "success");
    const error = args.every((el) => el === "error");
    if (success) {
        status = "success";
    } else if (error) {
        status = "error";
    } else {
        status = "loading";
    }
    return { status };
};
