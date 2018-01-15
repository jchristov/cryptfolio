function Binance(apiKey, secret) {
  this._rootUrl = 'https://api.binance.com/';
  Logger.log('Key: ' + apiKey + '- secret: ' + secret);
  this._apiKey = apiKey;
  this._secret = secret;
}
Binance.prototype.get = function(path, qs) {
  var timestamp = new Date().getTime();
  var queryString = (qs ? qs + '&' : '') + 'timestamp=' + timestamp;
  var signature = this.sign(queryString);
  var url = this._rootUrl + path + "?" + queryString + '&signature=' + signature;
  var headers = {
    'X-MBX-APIKEY': this._apiKey
  };
  var response = UrlFetchApp.fetch(url, { headers: headers });
  var json = JSON.parse(response.getContentText());
  return json;
}
Binance.prototype.getPublic = function(path, qs) {
  try {
    var queryString = (qs ? '?' + qs : '')
    var url = this._rootUrl + path + queryString;
    var headers = {
      'X-MBX-APIKEY': this._apiKey
    };
    var req = UrlFetchApp.getRequest(url, { headers: headers });
    var response = UrlFetchApp.fetch(url, { headers: headers });
    var json = JSON.parse(response.getContentText());
    return json;
  } catch (e) {
    Logger.log(e);
  }
}
Binance.prototype.getAllOrders = function (symbol) {
  return this.get('api/v3/allOrders', 'symbol=' + symbol)
}

Binance.prototype.getAccountInfo = function () {
  return this.get('api/v3/account', '');
}

Binance.prototype.getMyTrades = function(symbol) {
  return this.get('api/v3/myTrades', 'symbol='+symbol);
}

Binance.prototype.getExchangeInfo = function () {
  return this.getPublic('/api/v1/exchangeInfo');
}
Binance.prototype.sign = function(data) {
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.setHMACKey(this._secret, "TEXT");
  shaObj.update(data);
  var hmac2 = shaObj.getHMAC("HEX");
  return hmac2;
}
Binance.prototype.getSymbolPrice = function(symbol) {
  return this.getPublic('api/v3/' + symbol + '/price');
}