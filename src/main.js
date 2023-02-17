// import lib to calc hash 
const sha256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// define what each block is going to look like 
// index - where block is in the chain (determined from a position in the array, not passes as an argument)
// timestamp - when the block was created
// transactions - transactions associated with the block (e.g. transaction details, sender, receiver, amount, etc.)
// previousHash - string that contains hash of the previous block (key component to ensuring the integrity of the chain)

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // hash of this block
        this.nonce = 0; // rnadom number that can be changed to stop the while loop
    }

    // method that calculates hash of this block
    calculateHash ( ) {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions + this.nonce)).toString(); // library returns obj, need to convert to string 
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
        this.difficutly = 2;
        this.pendingTransactions = [];
        this.miningRewards = 100; // how many coins a miner gets for successfully mining a block

    }

    // first block needs to be created manually 
    createGenesisBlock ( ) {
        return new Block("01/13/2023", "Genesis Block", "0");
    }

    // method to get latest block (the last block in the chain gets returned)
    getLatestBlock ( ) {
        return this.chain[this.chain.length - 1];
    }

    // method to mine
    // receives an address to successfully pass on reward to the miner if the block is mined successfully
    minePendingTransactions (miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficutly);
        console.log('Block mined successfully.');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningRewards)
        ];
    }

    createTranasction (transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress (address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= this.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
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

let vcoin = new Blockchain();

// sending transaction
vcoin.createTranasction(new Transaction('address1', 'address2', 100)); // address1 sends address 2 100 coins
vcoin.createTranasction(new Transaction('address2', 'address1', 50)); 

// starting to mine
console.log('\n Minig started... ⛏️');
vcoin.minePendingTransactions('minerAddress');

// check miner's balance after mining is done
console.log(`\n Miner's balance is ${vcoin.getBalanceOfAddress('minerAddress')} now.`);

// starting to mine again 
console.log('\n Minig started again ... ⛏️');
vcoin.minePendingTransactions('minerAddress');

// check miner's balance after second mining is done
console.log(`\n Miner's balance is ${vcoin.getBalanceOfAddress('minerAddress')} now.`);

