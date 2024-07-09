import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
function Header() {
    async function getNFTs() {
        const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
        console.log(userNFTIds);
    }
    ;
    useEffect(() => {
        getNFTs();
    }, []);
    return (React.createElement(BrowserRouter, null,
        React.createElement("div", { className: "app-root-1" },
            React.createElement("header", { className: "Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4" },
                React.createElement("div", { className: "Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters" },
                    React.createElement("div", { className: "header-left-4" }),
                    React.createElement("img", { className: "header-logo-11", src: logo }),
                    React.createElement("div", { className: "header-vertical-9" }),
                    React.createElement(Link, { to: "/" },
                        React.createElement("h5", { className: "Typography-root header-logo-text" }, "OpenD")),
                    React.createElement("div", { className: "header-empty-6" }),
                    React.createElement("div", { className: "header-space-8" }),
                    React.createElement("button", { className: "ButtonBase-root Button-root Button-text header-navButtons-3" },
                        React.createElement(Link, { to: "/discover" }, "Discover")),
                    React.createElement("button", { className: "ButtonBase-root Button-root Button-text header-navButtons-3" },
                        React.createElement(Link, { to: "/minter" }, "Minter")),
                    React.createElement("button", { className: "ButtonBase-root Button-root Button-text header-navButtons-3" },
                        React.createElement(Link, { to: "/collection" }, "My NFTs"))))),
        React.createElement(Switch, null,
            React.createElement(Route, { exact: true, path: "/" },
                React.createElement("img", { className: "bottom-space", src: homeImage })),
            React.createElement(Route, { path: "/discover" },
                React.createElement("h1", null, "Discover")),
            React.createElement(Route, { path: "/minter" },
                React.createElement(Minter, null)),
            React.createElement(Route, { path: "/collection" },
                React.createElement(Gallery, { title: "My NFTs" })))));
}
export default Header;
