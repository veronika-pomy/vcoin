// import lib to calc hash 
const sha256 = require('./node_modules/crypto-js/sha256');

// define what each block is going to look like 
// index - where block is in the chain
// timestamp - when the block was created
// data - data associated with the block (e.g. transaction details, sender, receiver, amount, etc.)
// previousHash - string that contains hash of the previous block (key component to ensuring the integrity of the chain)

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // hash of this block
        this.nonce = 0; // rnadom number that can be changed to stop the while loop
    }

    // method that calculates hash of this block
    calculateHash ( ) {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data + this.nonce)).toString(); // library returns obj, need to convert to string 
    };

    // method increases difficulty 
    // bit coin asks that hash of a block begins with a certain amount of zeros, this increases computational power needed to make a block becauase a computer needs to go trhough a certain number of combinations to get a desired hash
    // accouts for speed with which computers can make computattions
    // difficulty sets how many characters of a string the method takes into account - more characters, greater difficulty 
    // hash needs to begin with all zeros in this case
    mineBlock (difficutly) {
        while(this.hash.substring(0,difficutly) !== Array(difficutly +1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mained ${this.hash}`);
    }


}

class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficutly = 4;

    }

    // first block needs to be created manually 
    createGenesisBlock ( ) {
        return new Block(0, "01/13/2023", "Genesis Block", "0");
    }

    // method to get latest block (the last block in the chain gets returned)
    getLatestBlock ( ) {
        return this.chain[this.chain.length - 1];
    }

    // method to create new block
    addNewBlock (newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; // set the previous hash to the hash of prev block
        newBlock.mineBlock(this.difficutly); // get a hash for the block with passed difficulty parameter
        this.chain.push(newBlock); // adds it to the chain
    }

    // method for validation
    // starts with block 1 because first block is genesis block
    isChainValid ( ) {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // chain invalid if current hash is not valid 
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            // chain invalid if current block doesn't point to correct previous block
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        // if everything is fine return true
        return true;
    }
}

let vcoin = new Blockchain;

console.log('Mining block 1... ⛏️');
vcoin.addNewBlock(new Block(1, "02/14/2023", { amount: 7 }));

console.log('Mining block 2... ⛏️');
vcoin.addNewBlock(new Block(2, "02/15/2023", { amount: 11 }));

// // blockchain
// console.log(JSON.stringify(vcoin, null, 4));

// // check validity
// console.log(`Is vcoin blockchain valid? ${vcoin.isChainValid()}`);

// // tempering with blockchain 
// vcoin.chain[1].data = { amount: 1000 };
// vcoin.chain[1].hash = vcoin.chain[1].calculateHash();

// // log tempered chain and check validity again
// console.log(JSON.stringify(vcoin, null, 4));
// console.log(`Is vcoin blockchain valid? ${vcoin.isChainValid()}`);

