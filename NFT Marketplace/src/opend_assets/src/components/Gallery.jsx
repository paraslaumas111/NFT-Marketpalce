import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {
  
  const [items, setItems] = useState();

  function fetchNFTs() {
    if(props.ids != undefined){
      setItems(
        props.ids.map( (NFTId) =>                  //To cycle through the array of NFT Ids passeed through props from Header.jsx
          <Item id={NFTId} key={NFTId.toText()} role={props.role}/>   //Convert Principal to Text
        )
      );
    }
  };

  useEffect( ()=>{
    fetchNFTs();
  }, [])

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
            {/* <Item id="rrkah-fqaaa-aaaaa-aaaaq-cai" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
