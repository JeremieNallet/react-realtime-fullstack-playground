import io from "socket.io-client";

export const server =
    process.env.REACT_APP_ENV === "production"
        ? "https://www.stumbly-server.xyz"
        : "http://localhost:8080";

const options = {
    secure: true,
    reconnection: true,
    rejectUnauthorized: false,
};
const socket = io.connect(server, options);
const lobbySocket = io.connect(`${server}/lobby`, options);
const groupSocket = io.connect(`${server}/groups`, options);
const messengerSocket = io.connect(`${server}/messenger`, options);
const notficationSocket = io.connect(`${server}/notification`, options);

export { lobbySocket, groupSocket, messengerSocket, socket, notficationSocket };
