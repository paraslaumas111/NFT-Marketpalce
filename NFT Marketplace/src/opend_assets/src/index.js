import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Principal } from "@dfinity/principal";
const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;
const init = async () => {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
};
init();
