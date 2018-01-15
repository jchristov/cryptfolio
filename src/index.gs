function UpdateBinanceBalances(config) {
  var balanceSheet = new BalanceSheet();
  var binance = new Binance(config.key, config.secret);
  var getAccountInfo = binance.getAccountInfo();
  var balances = getAccountInfo.balances;
  balanceSheet.writeBalances(balances, 'Binance');
}

function UpdateCMCPrices() {
  var CMC = new CoinMarketCap();
  CMC.refreshTickerPrices();
}

function UpdateBittrexBalances(config) {
  var balanceSheet = new BalanceSheet()
  var bittrex = new Bittrex(config.key, config.secret);
  var bittrexBalances = bittrex.getBalances().result;
  var balances = map(bittrexBalances, function(i) { return { free: i.Available, asset: i.Currency, locked: i.Pending }; })
  balanceSheet.writeBalances(balances, 'Bittrex');
}

function UpdateTrades(config) {
   function getAndRecordTradesForSymbol(symbol) {
    Logger.log('Getting trades for symbol: ' + symbol)
    var binance = new Binance(config.key, config.secret);
    var trades = binance.getMyTrades(symbol);
    if (trades.length > 0) {
      var ts = new TradesSheet(symbol);
      // Write trades to the relevant symbol sheet.
      ts.appendTrades(trades)
    }
    Logger.log('Trades for symbol: ' + symbol + ' - ' + trades.length)
  }

  // Get exchange info, calculate symbols, and get all completed trades.
  var binance = new Binance(config.key, config.secret);
  var exchangeInfo = binance.getExchangeInfo();
  var symbolExistenceMap = getSymbolExistenceMap(exchangeInfo.symbols)
  var allTickers = getAllTickers(balances, symbolExistenceMap);

  // With the list of all tickers fetch all the trades for that symbol and record them in the related sheet.
  var BinancePrices = new ExchangePriceSheet('Binance', binance);
  BinancePrices.refreshPrices(allTickers);
  for (var tickerInd = 0; tickerInd < allTickers.length; tickerInd++) {
    var ticker = allTickers[tickerInd];
    var priceRecord = binance.getSymbolPrice(ticker);
    getAndRecordTradesForSymbol(ticker);
  }
}

function UpdateCoinbase(config) {
  // Coinbase
  var coinbase = new Coinbase(config.key, config.secret);
  var accounts = coinbase.getAccounts();
  Logger.log(accounts)
}

function UpdateDashboard() {
  var dashboard = new DashboardSheet();
  dashboard.updateHoldings();
}

function UpdateHistory() {
  var history = new HistorySheet();
  history.recordHistory();
}

/**
 * The main entry point.
 *
 * You can point to this function with a trigger (e.g. run every hour or run when open)
 * to keep your spreadsheet current.
 */
function Run() {
  var config = new Config().getConfig();
  UpdateCMCPrices();
  if (config.binance.key && config.binance.secret) {
    UpdateBinanceBalances(config.binance);
  }
  if (config.bittrex.key && config.bittrex.secret) {
    UpdateBittrexBalances(config.bittrex);
  }
  UpdateDashboard();
  UpdateHistory();
}