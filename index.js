var http = require("http"),
    request = require("request");

function fetchExchangeRate(currency, success) {
  request.get("http://blockchain.info/ticker", function(error, response, body) {
    if (response.statusCode == 200) {
      var rates = JSON.parse(body),
          rate = rates[currency]['15m'];

      success(rate);
    }
  });
}

var port = process.env.PORT || 5000;

http.createServer(function(request, response) {
  fetchExchangeRate("USD", function(rate) {
    var payload = { item: [{ value: rate, prefix: "$" }] };

    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(payload));
    response.end();
  });
}).listen(port);
