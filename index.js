var http = require("http"),
    request = require("request"),
    port = process.env.PORT || 5000;

function fetchExchangeRate(success) {
  request.get("http://blockchain.info/ticker", function(error, response, body) {
    if (response.statusCode == 200) {
      var currencies = JSON.parse(body),
          rates = {};

      for (var currency in currencies) {
        if (currencies.hasOwnProperty(currency)) {
          var historical = currencies[currency],
              last = historical.last;
          rates[currency] = last.toFixed(2);
        }
      }

      success(rates);
    }
  });
}

http.createServer(function(request, response) {
  fetchExchangeRate(function(rates) {
    var payload = {
      absolute: true,
      item: [
        { value: rates["USD"], prefix: "$" },
        { value: rates["GBP"], prefix: "£" }
      ]
    };

    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(payload));
    response.end();
  });
}).listen(port);
