const reqSvgs = require.context("./", true, /\.svg$/);
const emojis = reqSvgs.keys().map((path) => ({ type: path, emoji: reqSvgs(path) }));
export default emojis;
