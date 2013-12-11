var http = require("http"),
    request = require("request"),
    port = process.env.PORT || 5000,
    ExchangeRate = function(currency, rates) {
      this.currency = currency;
      this.symbol = rates.symbol;
      this.value = rates.last;
    };

function fetchExchangeRate(callback) {
  request.get("http://blockchain.info/ticker", function(error, response, body) {
    var exchangeRates = {};

    if (response.statusCode == 200) {
      var currencies = JSON.parse(body);

      for (var currency in currencies) {
        if (currencies.hasOwnProperty(currency)) {
          var rates = currencies[currency];
          exchangeRates[currency] = new ExchangeRate(currency, rates);
        }
      }
    }

    callback(exchangeRates);
  });
}

http.createServer(function(request, response) {
  var path = request.url.split('/'),
      currency = path[1].toUpperCase() || "USD";

  fetchExchangeRate(function(rates) {
    var payload,
        statusCode;

    if (rates.hasOwnProperty(currency)) {
      var rate = rates[currency];

      payload = {
        item: [{
          value: rate.value,
          prefix: rate.symbol
        }]
      };

      statusCode = 200;
    }
    else {
      payload = { error: "Currency not found: " + currency };
      statusCode = 404;
    }

    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.write(JSON.stringify(payload));
    response.end();
  });
}).listen(port);
