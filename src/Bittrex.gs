function Bittrex(apiKey, secret) {
  this._apiKey = apiKey;
  // this._secret = Utilities.base64Encode(Utilities.newBlob(secret).getBytes());
  this._secret = secret;
  this._rootUrl = 'https://bittrex.com/api/v1.1/';
  Logger.log('Key: ' + this._apiKey + ' - Secret: ' + this._secret);
}
Bittrex.prototype.get = function(path, qs) {
  // Call the Numbers API for random math fact
  var timestamp = Math.round(new Date().getTime())
  var url = this._rootUrl + path + "?" + 'apikey=' + this._apiKey + '&nonce=' + timestamp;
  Logger.log('URL: ' + url);
  var apisign = this.sign(url);
  var headers = {
    'apisign': apisign
  };
  Logger.log('apisign: ' + apisign);
  var response = UrlFetchApp.fetch(url, { headers: headers });
  var json = JSON.parse(response.getContentText());
  return json;
}
Bittrex.prototype.getPublic = function(path, qs) {
  var queryString = (qs ? '?' + qs : '')
  var url = this._rootUrl + path + queryString;
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  return json;
}
Bittrex.prototype.sign = function(data) {
  var shaObj = new jsSHA512("SHA-512", "TEXT");
  shaObj.setHMACKey(this._secret, "TEXT");
  shaObj.update(data);
  var hmac2 = shaObj.getHMAC("HEX");
  return hmac2;
}
Bittrex.prototype.getMarkets = function() {
  return this.getPublic('public/getmarkets');
}
Bittrex.prototype.getBalances = function() {
  return this.get('account/getbalances');
}
