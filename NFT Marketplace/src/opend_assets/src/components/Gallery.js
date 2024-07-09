import React from "react";
import Item from "./Item";
function Gallery(props) {
    return (React.createElement("div", { className: "gallery-view" },
        React.createElement("h3", { className: "makeStyles-title-99 Typography-h3" }, props.title),
        React.createElement("div", { className: "disGrid-root disGrid-container disGrid-spacing-xs-2" },
            React.createElement("div", { className: "disGrid-root disGrid-item disGrid-grid-xs-12" },
                React.createElement("div", { className: "disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center" }),
                React.createElement(Item, { id: "rrkah-fqaaa-aaaaa-aaaaq-cai" })))));
}
export default Gallery;
