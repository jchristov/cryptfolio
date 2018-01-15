function CoinMarketCap() {
  this._sheet = SpreadsheetApp.getActive().getSheetByName('CMC Prices');
  if (!this._sheet) {
    SpreadsheetApp.getActive().insertSheet('CMC Prices');
    this._sheet = SpreadsheetApp.getActive().getSheetByName('CMC Prices');
    this._sheet.appendRow(['Rank', 'Symbol', 'Price (USD)', 'Market Cap', '24h Volume', 'Last Updated']);
  }
}
CoinMarketCap.prototype.refreshTickerPrices = function() {
  var start = 0;
  var sheet = this._sheet;
  while (start < 150) {
    var req = UrlFetchApp.fetch('https://api.coinmarketcap.com/v1/ticker?start=' + start + '&limit=10');
    if (start === 0) {
      sheet.clear();
      sheet.appendRow(['Rank', 'Symbol', 'Price (USD)', 'Market Cap', '24h Volume', 'Last Updated']);
    }
    start += 10;
    if (!req) { continue; }
    var json = JSON.parse(req.getContentText());
    for (var pi = 0; pi < json.length; pi++) {
      var priceItem = json[pi];
      sheet.appendRow(
        [priceItem.rank, priceItem.symbol, priceItem.price_usd, priceItem.market_cap_usd, priceItem['24h_volume_usd'], priceItem.last_updated]
      );
    }
  }
}
CoinMarketCap.prototype.getPriceMap = function() {
  var values = this.getSheet().getDataRange().getValues();
  return reduce(values, function(acc, item, i) {
    if (i === 0) { return acc; }
    // Correct this mismatch
    var key = item[1];
    if ( item[1] === 'MIOTA' ) { key = 'IOTA' }
    var val = item[2];
    acc[key] = parseFloat(item[2]);
    return acc;
  }, {});
}
CoinMarketCap.prototype.getSheet = function() {
  return SpreadsheetApp.getActive().getSheetByName('CMC Prices');
}