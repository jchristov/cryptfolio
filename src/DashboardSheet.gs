function initChart() {
  // Create historical values chart.
  var sheet = SpreadsheetApp.getActive().getSheetByName('Dashboard');
  var chartBuilder = sheet.newChart();
  var history = new HistorySheet();
  chartBuilder.addRange(history.getData()).setChartType(Charts.ChartType.LINE).setOption('title', 'History');
  sheet.insertChart(chartBuilder.build());
}

function DashboardSheet() {
  this._name = 'Dashboard';
  var spread = SpreadsheetApp.getActive();
  var sheet = spread.getSheetByName(this._name);
  if (!sheet) {
    spread.insertSheet(this._name);
    sheet = spread.getSheetByName(this._name);
    sheet.getRange(1,1).setValue('Total:');
    sheet.getRange(2, 1).setValue('Last Updated:');
    sheet.getRange(4, 1).setValue('Holdings');
    sheet.getRange(5, 1).setValue('Asset');
    sheet.getRange(5, 2).setValue('Amount');
    sheet.getRange(5, 3).setValue('Price');
    sheet.getRange(5, 4).setValue('Value');
    initChart();
  }
  return this;
}
DashboardSheet.prototype.updateHoldings = function() {
  var spread = SpreadsheetApp.getActive();
  var sheet = spread.getSheetByName(this._name);
  var range = sheet.getDataRange();
  range.clear();
  sheet.getRange(1,1).setValue('Total:');
  sheet.getRange(2, 1).setValue('Last Updated:');
  sheet.getRange(4, 1).setValue('Holdings');
  sheet.getRange(5, 1).setValue('Asset');
  sheet.getRange(5, 2).setValue('Amount');
  sheet.getRange(5, 3).setValue('Price');
  sheet.getRange(5, 4).setValue('Value');
  sheet.getRange(5, 5).setValue('Dominance');
  var dashboard = spread.getSheetByName(this._name);
  var balanceSheet = new BalanceSheet();
  var balanceMap = balanceSheet.getTotalBalances();
  var assets = Object.keys(balanceMap);
  var prices = new CoinMarketCap().getPriceMap()
  var accTotal = 0;
  Logger.log(JSON.stringify(balanceMap));
  for (var ind = 0; ind < assets.length; ind++) {
    var key = assets[ind];
    var total = balanceMap[key].total;
    var price = prices[key];
    var value = total * price;
    accTotal += value;
  }
  for (var ind = 0; ind < assets.length; ind++) {
    var key = assets[ind];
    var total = balanceMap[key].total;
    var price = prices[key];
    var value = total * price;
    var dominance = value / accTotal;
    Logger.log('Key: ' + key + ' total: ' + total)
    sheet.getRange(6 + ind,1).setValue(key);
    sheet.getRange(6 + ind,2).setValue(total);
    sheet.getRange(6 + ind,3).setValue(price);
    sheet.getRange(6 + ind,4).setValue(value);
    sheet.getRange(6 + ind,5).setValue(dominance);
  }
  sheet.getRange(1,2).setValue(accTotal);
  sheet.getRange(2,2).setValue(new Date().toString());
}
