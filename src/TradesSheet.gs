function TradesSheet(symbol) {
  this._symbol = symbol;
  this._name = 'TRADES - ' + symbol;
  this.init();
  this._sheet = SpreadsheetApp.getActive().getSheetByName(this._name);
}
TradesSheet.prototype.init = function() {
  var spread = SpreadsheetApp.getActive();
  var sheet = spread.getSheetByName(this._name);
  if (!sheet) {
    spread.insertSheet(this._name)
    spread.getSheetByName(this._name).appendRow(['Symbol','ID','Quantity','Price','Maker/Buyer','Commission','Commision Asset']);
  }
  return sheet;
}
TradesSheet.prototype.getSheet = function() {
  return SpreadsheetApp.getActive().getSheetByName(this._name)
}
TradesSheet.prototype.writeTrades = function() {
  var sheet = this.getSheet();
  var existingTrades = readTrades(symbol);
  var keyedTrades = keyBy('id', existingTrades);
  for (var tradeIndex = 0; tradeIndex < trades.length; tradeIndex++) {
    var row = trades[tradeIndex]
    if (!keyedTrades[row.id]) {
      Logger.log('Writing trade: ' + JSON.stringify(row))
      var makerBuyer = row.isBuyer ? 'Buyer' : 'Maker';
      sheet.appendRow([symbol, row.id, row.qty, row.price, makerBuyer, row.commission, row.commissionAsset]);
    }
  }
}
TradesSheet.prototype.init = function() {
  Logger.log('Creating sheet: ' + this._name);
  var sheet = this.getSheet();
  if (!sheet) {
    SpreadsheetApp.getActive().insertSheet(this._name);
    var sheet = this.getSheet();
     sheet.appendRow(['Symbol', 'ID', 'Quantity', 'Price', 'Maker/Buyer', 'Commission', 'Commision Asset']);
  }
}
TradesSheet.prototype.appendTrades = function(trades) {
  var sheet = this._sheet;
  var existingTrades = this.readTrades();
  var keyedTrades = keyBy('id', existingTrades);
  for (var tradeIndex = 0; tradeIndex < trades.length; tradeIndex++) {
    var row = trades[tradeIndex]
    if (!keyedTrades[row.id]) {
      Logger.log('Writing trade: ' + JSON.stringify(row))
      var makerBuyer = row.isBuyer ? 'Buyer' : 'Maker';
      sheet.appendRow([this._symbol, row.id, row.qty, row.price, makerBuyer, row.commission, row.commissionAsset]);
    }
  }
}
/**
* Read the trades for a given symbol and return as an array of objects.
*/
TradesSheet.prototype.readTrades = function() {
    var sheet = this._sheet;
    var dataRange = sheet.getDataRange().getValues();
    var results = [];
    for (var j = 0; j < dataRange.length; j++) {
      // Skip header line
      if (j === 0) { continue; }
      var row = dataRange[j];
      results.push({
        symbol: row[0],
        id: row[1],
        quantity: row[2],
        price: row[3],
        makerBuyer: row[4],
        commission: row[5],
        commissionAsset: row[6]
      });
    }
    return results;
}