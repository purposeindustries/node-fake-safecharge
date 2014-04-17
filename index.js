var http = require('http');
var url = require('url');
var qs = require('querystring');
var crypto = require('crypto');


module.exports = function middleware(opts) {
  opts = opts || {};
  if(!opts.secret) {
    throw new Error('You must specify `secret`!');
  }

  function purchase(req, res) {
    var q = url.parse(req.url, true).query;
    var secret = opts.secret;
    var totalAmount = q.total_amount;
    var currency = q.currency;
    var responseTimeStamp = 'foobar';
    var PPP_TransactionID = 1234;
    var status = opts.status;
    var productId = opts.productId || 1234;
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
    var values = {
      totalAmount: totalAmount,
      currency: currency,
      responseTimeStamp: responseTimeStamp,
      PPP_TransactionID: PPP_TransactionID,
      Status: status,
      productId: productId,
      first_name: q.first_name || opts.firstName || 'foo',
      last_name: q.last_name || opts.lastName || 'bar',
      advanceResponseChecksum: checksum,
      country: q.country || opts.country || 'US',
      Token: opts.token || 'AAAAAAAA',
      cardNumber: q.cc_card_number
                  ? '****' + q.cc_card_number.split(-4)
                  : '****' + opts.cardNumber,
      expYear: q.cc_exp_year || opts.expYear || '17',
      expMonth: q.cc_exp_month || opts.expMonth || '05',
      cardCompany: opts.cardCompany || 'VISA'
    };
    var redirectParameters = [
      'totalAmount', 'currency',
      'responseTimeStamp', 'PPP_TransactionID',
      'Status', 'productId',
      'advanceResponseChecksum',
    ].reduce(function(opts, key) {
      opts[key] = values[key];
      return opts;
    }, {});
    var callbackParameters = values;
    res.writeHead(302, {
      'Location': q.success_url + '?' + qs.stringify(redirectParameters)
    });
    res.end();
    setTimeout(function() {
      http.get( opts.callback + '?' + qs.stringify(values), function(res) {
        console.log('Callback...');
      });
    }, opts.delay || 2000);
  }

  return function server(req, res) {
    purchase(req, res);
  };
};
