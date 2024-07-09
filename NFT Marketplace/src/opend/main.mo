import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor OpenD {

    private type Listing = {
        itemOwner: Principal; //PID of Owner of the NFT
        itemPrice: Nat; //Price of the NFT
    };

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    public shared(msg) func mint(imageData: [Nat8], name: Text) : async Principal {
        let owner : Principal = msg.caller;

        Debug.print(debug_show(Cycles.balance()));  //See  balance before create
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActorClass.NFT(name, owner, imageData);   //newly created NFT
        Debug.print(debug_show(Cycles.balance()));  //See  balance after create

        let newNFTCanisterID = await newNFT.getCansiterID();

        mapOfNFTs.put(newNFTCanisterID, newNFT); //Adding new NFT to collection of its owner
        addToOwnershipMap(owner, newNFTCanisterID);

        return newNFTCanisterID;
    };

    private func addToOwnershipMap (owner: Principal, nftID: Principal) {

        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {   
            case null List.nil<Principal>();     // method to create an empty List in case result is null
            case (?result) result;  // list of owned NFTs gets stored in this ownedNFTs as it is, in case the user has some NFTs
        };
    
        ownedNFTs := List.push(nftID, ownedNFTs);   //method to add new member to a list
        mapOfOwners.put(owner, ownedNFTs);     

    };

    public query func getOwnedNFTs(user: Principal) : async [Principal] {   //user: PID of owner

        var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {   
            case null List.nil<Principal>();     // method to create an emppty List
            case (?result) result;  // list of owned NFTs gets stored in this variable
        };
        
        return List.toArray(userNFTs);    //function to convert List into array DT
    };

    public query func getListedNFTs () : async [Principal] {     //Note; By putting [] around Principal DT, it means that it'll return an array of Principal DT
        let ids = Iter.toArray(mapOfListings.keys());      //keys() returns an Iter DT. Now our keys are stored as array items in var ids
        return ids;
    };

    //This function will put our NFT onto HashMap of Listings, i.e. transfer the ownership of the NFT to the OpenD canister, so that when somebody buys it,
    // it'll be able to transfer it to them
    public shared(msg) func listItem (id: Principal, price: Nat) : async Text { //Pid of the NFT being listed, price-how much that NFT is listed for(i.e. its price)
     
        var item: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT doesn't exist";
            case (?result) result;
        };
        let owner = await item.getOwner();
        //The caller of this function should be the one who is the owner of the NFT being accessed here
        if(Principal.equal(owner, msg.caller)){ //This is how equality of Pricipal DTs is checked
            let newlistItem : Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            mapOfListings.put(id, newlistItem);
            return "successfully added to the list of Listed NFTs";
        } else {
            return "You don't own this NFT!";
        }
    };

    public query func getOpenDCanisterID() : async Principal {
        return Principal.fromActor(OpenD);
    };

    public query func isListed(id: Principal) : async Bool {
        if(mapOfListings.get(id) == null){
            return false;
        } else {
            return true;
        }
    };

    public query func getOriginalOwner(id: Principal) : async Principal {
        var listing : Listing = switch (mapOfListings.get(id)){
            case null return Principal.fromText("");
            case (?result) result;
        };

        return listing.itemOwner;
    };

    public query func getListedNFTPrice(id: Principal) : async Nat {
        var listing : Listing = switch (mapOfListings.get(id)){
            case null return 0;
            case (?result) result;
        };

        return listing.itemPrice;
    };

    public shared(msg) func completePurchase (id: Principal, ownerId: Principal, newOwnerId: Principal) : async Text { 
        //Pid of the NFT being transferred

        var purchasedNFT: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
            case null return "NFT doesn't exist";
            case (?result) result;
        };
        let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
        if(transferResult == "Transfer successful"){ 
            mapOfListings.delete(id);
            var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId)){
                case null List.nil<Principal>();
                case (?result) result;
            };
            ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) :Bool{
                return listItemId != id;    
            });
            //This method will update the ownedNFTs list. If this function returns True,
            //then that particular NFTid will get added to this new list, and if this function returns false
            //then that particular NFTid will get omitted from this new list
            //i.e. if the buyer doesn't have this NFT then it will get added to his collection, otherwise not.
            addToOwnershipMap(newOwnerId,id);
            return "Success";
        } else {
            return transferResult;
        }
    };    

};
