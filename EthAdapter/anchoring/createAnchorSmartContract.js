global.transactionNonce = -1
const utils = require("./utils");
function createAnchor(anchorFactory, account, anchorID, newAnchorValue, callback) {
    //Concurrent transactions
    //https://github.com/ChainSafe/web3.js/issues/1301
    //fixed in 2.0, but is alpha

    anchorFactory.web3.eth.getTransactionCount(account).then(
        (nonce) => {
            if (global.transactionNonce === -1) {
                global.transactionNonce = nonce;
            } else {
                global.transactionNonce++;
            }
            console.log('Transaction Nonce  :', global.transactionNonce);

            utils.createAnchor(anchorFactory, account, anchorID, newAnchorValue, global.transactionNonce, callback);
        }
    ).catch((err) => {
        console.log(err);
        callback(err, null);
    });

}



module.exports = createAnchor;
