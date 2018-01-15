function BalanceSheet() {
  this._name = 'Balances';
  var spread = SpreadsheetApp.getActiveSpreadsheet();
  this._sheet = spread.getSheetByName(this._name);
  if (!this._sheet) {
    spread.insertSheet(this._name);
    this._sheet = spread.getSheetByName(this._name);
    this._sheet.appendRow(['Symbol','Free','Locked', 'Total', 'Exchange']);
  }
}
BalanceSheet.prototype.getTotalBalances = function() {
  var dataRange = this._sheet.getDataRange().getValues();
  var balances = map(dataRange, function(item) { return { asset: item[0], free: parseFloat(item[1]), locked: parseFloat(item[2]), total: parseFloat(item[3]) } });
  Logger.log(JSON.stringify(balances));
  var reducedBalances = reduce(balances, function(acc, item, i) {
    if ( i === 0 ) { return acc; }
    var existing = acc[item.asset]
    if (existing) {
      acc[item.asset] = { asset: item.asset, free: parseFloat(item.free) + existing.free, locked: parseFloat(item.locked) + existing.locked, total: parseFloat(item.total) + existing.total };
    } else {
      acc[item.asset] = item
    }
    return acc;
  }, {});
  Logger.log(JSON.stringify(reducedBalances));
  return reducedBalances;
}
BalanceSheet.prototype.writeBalances = function(balances, exchange) {
  exchange = exchange ? exchange : 'Binance'
  var tickerToLineMap = this.getBalanceTickerToLineMap();
  for (var i = 0; i < balances.length; i++) {
    var row = balances[i];
    var asset = row.asset;
    var free = row.free;
    var locked = row.locked;
    var assetLine = this.getLineForTickerAndExchange(asset, exchange);
    Logger.log('Asset ' + asset + ' on line ' + assetLine + ' and exchange ' + exchange);
    if ((free || locked) && assetLine !== -1) {
      var lineExchange = this._sheet.getRange(assetLine, 5).getValue();
      Logger.log('Asset ' + asset + ' on line ' + assetLine + ' and exchange ' + exchange + ' and found exchange ' + lineExchange);
      if (lineExchange === exchange) {
        var valueCell = this._sheet.getRange(assetLine, 2);
        valueCell.setValue(parseFloat(free));
        var lockedCell = this._sheet.getRange(assetLine, 3);
        lockedCell.setValue(parseFloat(locked));
        var lockedCell = this._sheet.getRange(assetLine, 4);
        lockedCell.setValue(parseFloat(free) + parseFloat(locked));
      }
    } else if (free > 0.0 || locked > 0.0) {
      this._sheet.appendRow([asset, parseFloat(free), parseFloat(locked), parseFloat(free) + parseFloat(locked), exchange]);
    }
  }
}
/**
* Returns a map of form { [ticker: string]: int } that points from the ticker symbol
* to its line in the sheet.
*/
BalanceSheet.prototype.getBalanceTickerToLineMap = function () {
  var dataRange = this._sheet.getDataRange().getValues();
  var tickerToLineMap = {}
  for (var j = 0; j < dataRange.length; j++) {
    // Skip header
    if (j === 0) { continue; }
    var row = dataRange[j];
    if (row[0] && !tickerToLineMap[row[0]]) {
      tickerToLineMap[row[0]] = j + 1;
    }
  }
  return tickerToLineMap;
}
BalanceSheet.prototype.getLineForTickerAndExchange = function (ticker, exchange) {
  var dataRange = this._sheet.getDataRange().getValues()
  for (var j = 0; j < dataRange.length; j++) {
    // Skip header
    if (j === 0) { continue; }
    var row = dataRange[j];
    Logger.log('Looking at ' + row[0] + ' ' + row[3]);
    if (row[0] === ticker && row[4] === exchange) {
      return j + 1;
    }
  }
  return -1;
}