const reqSvgs = require.context("./", true, /\.svg$/);
const svgs = reqSvgs.keys().map((path) => ({ name: path, img: reqSvgs(path) }));
export default svgs;
