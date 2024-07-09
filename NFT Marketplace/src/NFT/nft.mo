import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {
    
    Debug.print("It is working!!");

    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content; //Actual imageData in bytes to be stored as an array of 8-bit natural numbers

    public query func getName(): async Text {
        return itemName;
    };

    public query func getOwner(): async Principal {
        return nftOwner;
    };

    public query func getAsset(): async [Nat8] {
        return imageBytes;
    };

    public query func getCansiterID(): async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
        if(msg.caller == nftOwner) {
            nftOwner := newOwner;
            return "Transfer successful";
        } else {
            return "You are not the owner of this NFT, hence you are not authorized to transfer it."
        }
    };

};