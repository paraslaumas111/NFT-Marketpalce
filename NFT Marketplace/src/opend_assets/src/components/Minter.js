import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { opend } from "../../../declarations/opend"; //Importing the canister to pass user inputs to it
import Item from "./Item";
function Minter() {
    const { register, handleSubmit } = useForm();
    const [nftPrincipal, setNFTPrincipal] = useState("");
    const [hideLoader, sethideLoader] = useState(true);
    async function onSubmit(data_entered) {
        sethideLoader(false);
        const name = data_entered.name;
        const image = data_entered.image[0];
        const imageArray = await image.arrayBuffer();
        const imageBytes = [...new Uint8Array(imageArray)];
        const newNFTID = await opend.mint(imageBytes, name);
        console.log(newNFTID.toText());
        setNFTPrincipal(newNFTID);
        sethideLoader(true);
    }
    ;
    if (nftPrincipal == "") {
        return (React.createElement("div", { className: "minter-container" },
            React.createElement("div", { hidden: hideLoader, className: "lds-ellipsis" },
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", null)),
            React.createElement("h3", { className: "makeStyles-title-99 Typography-h3 form-Typography-gutterBottom" }, "Create NFT"),
            React.createElement("h6", { className: "form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom" }, "Upload Image"),
            React.createElement("form", { className: "makeStyles-form-109", noValidate: "", autoComplete: "off" },
                React.createElement("div", { className: "upload-container" },
                    React.createElement("input", { ...register("image", { required: true }), className: "upload", type: "file", accept: "image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp" })),
                React.createElement("h6", { className: "form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom" }, "Collection Name"),
                React.createElement("div", { className: "form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth" },
                    React.createElement("div", { className: "form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl" },
                        React.createElement("input", { ...register("name", { required: true }), placeholder: "e.g. CryptoDunks", type: "text", className: "form-InputBase-input form-OutlinedInput-input" }),
                        React.createElement("fieldset", { className: "PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline" }))),
                React.createElement("div", { className: "form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable" },
                    React.createElement("span", { onClick: handleSubmit(onSubmit), className: "form-Chip-label" }, "Mint NFT")))));
    }
    else {
        return (React.createElement("div", { className: "minter-container" },
            React.createElement("h3", { className: "Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom" }, "Minted!"),
            React.createElement("div", { className: "horizontal-center" },
                React.createElement(Item, { id: nftPrincipal.toText() }))));
    }
}
export default Minter;
