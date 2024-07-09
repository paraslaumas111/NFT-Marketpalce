import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
// import { canisterId } from "../../../declarations/nft/index";
function Item(props) {
    const [name, setName] = useState();
    const [owner, setOwner] = useState();
    const [iamge, setAsset] = useState();
    const id = Principal.fromText(props.id);
    const localhost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localhost });
    async function loadNFT() {
        const NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: id,
        });
        const NAME = await NFTActor.getName();
        const OWNER = await NFTActor.getOwner();
        const IMAGEData = await NFTActor.getAsset();
        const IMAGEContent = new Uint8Array(IMAGEData);
        const IMAGE = URL.createObjectURL(new Blob([IMAGEContent.buffer], { type: "image/png" }));
        setOwner(OWNER.toText());
        setName(NAME);
        setAsset(IMAGE);
    }
    ;
    useEffect(() => {
        loadNFT();
    }, []);
    return (React.createElement("div", { className: "disGrid-item" },
        React.createElement("div", { className: "disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded" },
            React.createElement("img", { className: "disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img", src: iamge }),
            React.createElement("div", { className: "disCardContent-root" },
                React.createElement("h2", { className: "disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom" },
                    name,
                    React.createElement("span", { className: "purple-text" })),
                React.createElement("p", { className: "disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary" },
                    "Owner: ",
                    owner)))));
}
export default Item;
