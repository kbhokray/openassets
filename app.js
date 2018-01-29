var openassets = require('openassets');
let request = require('request');


// A wrapper to generate a "transaction provider" given a config.
// 
// For generality, connection to the Bitcoin JSON-RPC service is
// externalized into the concept of a "transaction provider" that is 
// expected to conform to the following simple API: given a Bitcoin
// transaction hash and a callback function, the provider must
// populate the callback with the results of the 'getRawTransaction'
// JSON-RPC call.
getTransactionProvider = function getTransactionProvider() {
  return function transactionProvider(hash, cb) {
    let url = 'https://api.blockcypher.com/v1/btc/main/txs/' + hash + '?includeHex=true';
    console.log('Calling Url: ' + url);
    request.get(url, (error, response, body) => {
      let json = JSON.parse(body);
      json.result = json.hex;
      cb(null, json);      
    });
  };
};

// Create an instance of the Open Assets ColoringEngine, and pass to
// it a configured transaction provider
ce = new openassets.ColoringEngine(getTransactionProvider());

// Use the coloring engine to obtain information about a transaction. In
// this case, get the 0th output of a known Open Assets 'issuance' transaction.
// The first argument is the hash of the transaction, the 2nd is the index
// of the output to retrieve, and the third is a callback function that will
// be populated with the asset ID and asset quantity information, if any, associated with
// that output.
ce.getOutput(
  '77a6bbc65aa0326015835a3813778df4a037c15fb655e8678f234d8e2fc7439c',
  0, function (err, data) {
  // If anything went wrong, say so
  if (err) {
    return console.log("Error = " + JSON.stringify(err));
  }

  // Print the asset information as a raw TransactionOutput object
  console.log(data);

  // Use the TransactionOutput.toString() method to get a more readable representation
  console.log(data.toString());

});
