import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import { opend } from "../../../declarations/opend";
import Button from "./Button";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";
import { token, idlFactory as tokenIDLFactory} from "../../../declarations/token";

function Item(props) {

  const [name,setName] = useState();
  const [owner,setOwner] = useState();
  const [iamge,setAsset] = useState();
  const [button,setButton] = useState();
  const [priceInput,setPriceInput] = useState();
  const [hideLoader,sethideLoader] = useState(true);
  const [blur,setBlur] = useState();
  const [sellStatus,setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay,setDisplay] = useState(true);


  // const id = Principal.fromText(props.id);
  const id = props.id; //since we converted it to Text in the Gallery.jsx before passing them to here in item.jsx

  const localhost = "http://localhost:8080/";
  const agent = new HttpAgent({host: localhost});
  agent.fetchRootKey(); //Remove this when we deploy the project on to the live ICB
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory,{ 
      agent,
      canisterId: id,
    });

    const NAME = await NFTActor.getName();
    const OWNER = await NFTActor.getOwner();
    const IMAGEData = await NFTActor.getAsset();
    const IMAGEContent = new Uint8Array(IMAGEData);
    const IMAGE = URL.createObjectURL(
      new Blob( [IMAGEContent.buffer], { type : "image/png"} )
    ); 

    setOwner(OWNER.toText());
    setName(NAME);
    setAsset(IMAGE);

    if(props.role == "collection"){
      const nftIsListed = await opend.isListed(props.id);

      if(nftIsListed){
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        sellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    } else if(props.role == "discover"){
      const originalOwner = await opend.getOriginalOwner(props.id);

      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />); 
    }
  };

  useEffect(() => {
    loadNFT();
  }, []);

  let price;

  function handleSell(){
    console.log("sell Clicked!!");
    setPriceInput(
      <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => price = e.target.value}
      />
    );
    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)  //After this the Loader should start until the sale/transfer/listing is complete
  }

  async function sellItem(){
    sethideLoader(false);
    console.log("Confirm Clicked, the setted price is:"+price);
    const listingResult = await opend.listItem(props.id,Number(price)); //Converting price from string to Number DT
    console.log("listing : "+listingResult);
    if(listingResult == "successfully added to the list of Listed NFTs"){
      const openDId = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      console.log("transfer to OpenD canister is : "+transferResult)
      if(transferResult == "Transfer successful"){
        sethideLoader(true);  //We want to take away the loader functionality after successful ransfer
        setButton();      //We want to take away the sell buttoon functionality after successful ransfer
        setPriceInput();    ////We want to take away the seting price functionality after successful ransfer
        setOwner("OpenD");     //We want to change the ownership to OpenD canister ID after successful transfer
        setSellStatus("Listed");    //We want to change the listed status after successful transfer
      }
    }
  }

  async function handleBuy(){
    console.log("Buy Clicked!!");
    sethideLoader(false);
    const tokenActor = await Actor.createActor(tokenIDLFactory,{ 
      agent,
      canisterId: Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai"),
    });

    const sellerId = await opend.getOriginalOwner(props.id);
    const itemPrice = await opend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId,itemPrice);
    console.log(result);
    if(result == "Success"){
      //Transfer the ownership
      const transferResult = await opend.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("purchase :" + transferResult);
      sethideLoader(true);
      setDisplay(false);
    }
}  

  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={iamge}
          style={blur}
        />
        <div hidden={hideLoader} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {priceLabel}
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
