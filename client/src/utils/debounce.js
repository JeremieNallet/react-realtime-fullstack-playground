const debounce = (fn, delay) => {
    let timeout;
    return function (...args) {
        clearInterval(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
};
export default debounce;
