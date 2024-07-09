import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
function Footer() {
    const year = new Date().getFullYear();
    return (React.createElement("div", { id: "footer" },
        React.createElement("footer", null,
            React.createElement(Container, { fluid: "md" },
                React.createElement(Row, null,
                    React.createElement(Col, null,
                        React.createElement("p", null, "The Internet Computer's largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.")),
                    React.createElement(Col, null,
                        React.createElement("p", null,
                            "Copyright \u24D2 ",
                            year)))))));
}
export default Footer;
