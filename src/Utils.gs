function keyBy(key, collection) {
  var accum = {};
  for (var i = 0; i < collection.length; i++) {
    var item = collection[i];
    accum[item[key]] = item;
  }
  return accum;
}
function getSymbolExistenceMap(symbols) {
  var symbolMap = {};
  for (var si = 0; si < symbols.length; si++) {
    var symbol = symbols[si].symbol;
    if (symbol) {
      symbolMap[symbol] = true
    }
  }
  return symbolMap;
}
/**
* Return a list of all tickers that we might be interested in.
* For now we assume all purchases made with ETH & BTC.
* For all tickers that we have a balance for add TICKERETH and TICKERBTC.
*/
function getAllTickers(balances, symbolExistenceMap) {
  var symbols = [];
  for (var i = 0; i < balances.length; i++) {
    var row = balances[i];
    var asset = row.asset;
    var free = row.free;
    var locked = row.locked;
    // Dont waste time on unowned coins.
    if (free == 0 && locked == 0.0) { continue; }
    var ethAsset = asset + 'ETH';
    if (symbolExistenceMap[ethAsset]) {
      symbols.push(ethAsset);
    }
    var btcAsset = asset + 'BTC';
    if (symbolExistenceMap[btcAsset]) {
      symbols.push(btcAsset);
    }
  }
  return symbols;
}
function testGetAllTickers() {
  var balances = [{ asset: 'ETH', free: 1234 }, { asset: 'BTC', free: 5 }, { asset: 'XLM', free: 1000 }];
  var tickers = getAllTickers(balances);
  if (tickers.length !== 4) {
    throw new Error('Expected 4 tickers in testGetAllTickers.');
  }
}
function map(collection, mapper) {
  if (!collection) { return []; }
  var results = [];
  for (var i = 0; i < collection.length; i++) {
    results.push(mapper(collection[i]));
  }
  return results;
}
function reduce(collection, reducer, acc) {
  acc = acc !== undefined ? acc : {};
  if (!collection) { return acc; }
  var results = acc;
  for (var i = 0; i < collection.length; i++) {
    results = reducer(acc, collection[i], i)
  }
  return results;
}