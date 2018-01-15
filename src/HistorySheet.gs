function HistorySheet() {
  this.sheet = SpreadsheetApp.getActive().getSheetByName('PortfolioHistory');
  if (!this.sheet) {
    SpreadsheetApp.getActive().insertSheet('PortfolioHistory');
    this.sheet = SpreadsheetApp.getActive().getSheetByName('PortfolioHistory');
    this.sheet.appendRow(['Date','Asset', 'Holdings', 'Price', 'Dominance', 'Value (USD)', 'Value (ETH)', 'Value (BTC)'])
  }
  this.historicalValuesSheet = SpreadsheetApp.getActive().getSheetByName('WorthHistory');
  if (!this.historicalValuesSheet) {
    SpreadsheetApp.getActive().insertSheet('WorthHistory');
    this.historicalValuesSheet = SpreadsheetApp.getActive().getSheetByName('WorthHistory');
    this.historicalValuesSheet.appendRow(['Date', 'Value (USD)', 'Value (ETH)', 'Value (BTC)']);
  }
}
HistorySheet.prototype.dateValueMap = function() {
  var data = this.sheet.getDataRange().getValues();
  var results = {};
  for (var ind = 0; ind < data.length; ind++) {
    if (ind === 0) { continue; }
    var line = data[ind];
    var date = line[0]; var valueUSD = line[5]; var valueETH = line[6]; var valueBTC = line[7];
    var existing = results[date];
    if (!existing) {
      results[date] = { usd: valueUSD, eth: valueETH, btc: valueBTC };
    } else {
      results[date] = { usd: valueUSD + existing.usd, eth: valueETH + existing.eth, btc: valueBTC + existing.btc };
    }
    return results;
  }
}
HistorySheet.prototype.recordHistory = function(lineNumber) {
  var balances = new BalanceSheet().getTotalBalances();
  var prices = new CoinMarketCap().getPriceMap();
  var assets = Object.keys(balances);
  var holdingsLine = map(assets, function(asset) { return balances[asset].total });
  var priceLine = map(assets, function(asset) { return prices[asset] });
  var valuesLine = map(assets, function(asset) { return prices[asset] * balances[asset].total });
  var date = new Date();
  var accTotal = 0;
  for (var ind = 0; ind < assets.length; ind++) {
    var asset = assets[ind];
    var total = prices[asset] * balances[asset].total;
    accTotal += total;
  }
  for (var ind = 0; ind < assets.length; ind++) {
    var asset = assets[ind];
    var total = prices[asset] * balances[asset].total;
    this.sheet.appendRow([date.getTime(), asset, balances[asset].total, prices[asset], total / accTotal, total, total / prices['ETH'], total / prices['BTC']]);
  }
  this.historicalValuesSheet.appendRow([date.toISOString(), accTotal, accTotal / prices['ETH'], accTotal / prices['BTC']])
}
HistorySheet.prototype.getData = function() {
  return this.sheet.getDataRange();
}

function Run() {
  var history = new HistorySheet();
  history.recordHistory();
}
