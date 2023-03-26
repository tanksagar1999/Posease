import React from "react";
import io from "socket.io-client";
import { getItem, setItem } from "../utility/localStorageControl";

const SocketContext = React.createContext();
let socketUrl = "";

const SocketProvider = ({ children }) => {
  let currentRegister = getItem("setupCache")?.register?.find(
    (val) => val.active
  );
  if (currentRegister?.server_ip_address != "") {
    socketUrl = `http://${currentRegister?.server_ip_address}:8000/`;
  }

  const socket = io(socketUrl);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
