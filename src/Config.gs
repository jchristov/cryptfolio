function Config() {
  this.sheet = SpreadsheetApp.getActive().getSheetByName('Config');
  if (!this.sheet) {
    SpreadsheetApp.getActive().insertSheet('Config');
    this.sheet = SpreadsheetApp.getActive().getSheetByName('Config');
    this.sheet.getRange(1, 1).setValue('Binance');
    this.sheet.getRange(2, 1).setValue('Key:');
    this.sheet.getRange(3, 1).setValue('Secret:');
    this.sheet.getRange(5, 1).setValue('Bittrex');
    this.sheet.getRange(6, 1).setValue('Key:');
    this.sheet.getRange(7, 1).setValue('Secret:');
  }
}
Config.prototype.getConfig = function() {
  var binanceKey = this.sheet.getRange(2, 2).getValue();
  var binanceSecret = this.sheet.getRange(3, 2).getValue();
  var bittrexKey = this.sheet.getRange(6, 2).getValue();
  var bittrexSecret = this.sheet.getRange(7, 2).getValue();
  var coinbaseKey = this.sheet.getRange(10, 2).getValue();
  var coinbaseSecret = this.sheet.getRange(11, 2).getValue();
  return {
    binance: {
      key: binanceKey,
      secret: binanceSecret
    },
    bittrex: {
      key: bittrexKey,
      secret: bittrexSecret
    },
    coinbase: {
      key: coinbaseKey,
      secret: coinbaseSecret
    }
  };
}
