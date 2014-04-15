var http = require('http');
var qs = require('querystring');
var crypto = require('crypto');

function purchase(req, res) {
  var query = qs.parse(req.url.split('?')[1]);
  var check = [
    secret,
    totalAmount,
    currency,
    responseTimeStamp,
    PPP_TransactionID,
    status,
    productId
  ].join('');
  var checksum = crypto.createHash('md5').update(check).digest('hex');
}

module.exports = function server(req, res) {
}
