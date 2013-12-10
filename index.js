var http = require("http"),
    request = require("request"),
    port = process.env.PORT || 5000;

function fetchExchangeRate(currency, success) {
  request.get("http://blockchain.info/ticker", function(error, response, body) {
    if (response.statusCode == 200) {
      var allRates = JSON.parse(body),
          rateValues = allRates[currency],
          rate = rateValues.hasOwnProperty('last') && rateValues.last;

      success(rate);
    }
  });
}

http.createServer(function(request, response) {
  fetchExchangeRate("USD", function(rate) {
    var payload = { item: [{ value: rate, prefix: "$" }] };

    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(payload));
    response.end();
  });
}).listen(port);
