/**
 * Still a work in progress.
 * @param key
 * @param secret
 */
function Coinbase(key, secret) {
  this.key = key;
  this.secret = secret;
  this.rootUrl = 'https://api.coinbase.com/v2/';
}
Coinbase.prototype.sign = function(data) {
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.setHMACKey(this.secret, "TEXT");
  shaObj.update(data);
  var hmac2 = shaObj.getHMAC("HEX");
  return hmac2;
}
Coinbase.prototype.get = function(path, qs) {
  var timestamp = this.getEpochTime();
  var phrase = timestamp + 'GET' + '/v2/' + path;
  Logger.log('phrase: ' + phrase);
  var signature = this.sign(phrase);
  Logger.log('signature: ' + signature);
  var url = this.rootUrl + path;
  var headers = {
    'CB-ACCESS-KEY': this.key,
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-VERSION': '2015-04-08'
  };
  var response = UrlFetchApp.fetch(url, { headers: headers });
  var json = JSON.parse(response.getContentText());
  return json;
}
Coinbase.prototype.getAccounts = function() {
  return this.get('accounts');
}
Coinbase.prototype.getEpochTime = function() {
  var url = this.rootUrl + 'time';
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  Logger.log(json);
  return json.data.epoch;
}