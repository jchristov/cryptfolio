function ExchangePriceSheet(exchange, binance) {
  this.exchange = exchange;
  this._binance = binance;
  this._sheet = SpreadsheetApp.getActive().getSheetByName('Balances');
  if (!this._sheet) {
    SpreadsheetApp.getActive().insertSheet('Balances');
    this._sheet = SpreadsheetApp.getActive().getSheetByName('Balances');
    this._sheet.appendRow(['Symbol', 'Price', 'Exchange', 'Last Updated']);
  }
}

ExchangePriceSheet.prototype.refreshPrices = function(symbols) {
  for (var i = 0; i < symbols.length; i++) {
    var symbol = symbols[i];
    var priceResult = this._binance.getSymbolPrice(symbol);
    if (!priceResult) { return; }
    var price = priceResult.price;
    var symbol = priceResult.symbol;
    var sheet = this._sheet;
    var existingPrices = sheet.getDataRange().getValues();
    var exists = false;
    for (var i = 0; i < existingPrices.length; i++) {
      // Ignore header
      if (i === 0) { continue; }
      var priceRow = existingPrices[i];
      if (priceRow[0] === symbol && priceRow[2] === this.exchange) {
        sheet.getDataRange(i, 2).setValue(price)
        exists = true;
      }
    }
    if (!exists) {
      sheet.appendRow([symbol, price, this.exchange, new Date.getTime()]);
    }
  }
}
