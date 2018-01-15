# cryptfolio

An automatic portfolio tracker on top of Google sheets.

# How to use

Cryptfolio will do most of the setup itself so getting started is as easy as copying over the code.

1. First go to google sheets (https://docs.google.com/spreadsheets) and create a new spreadsheet.

2. From within your new spreadsheet click **Tools** in the menu and select **Script editor...**

3. Copy all the files in the **src** directory to the scripts editor in Google sheets.

4. After copying the scripts over open **index.gs** and then click the icon the looks like a clock in the script editor menu. Create a trigger the runs the **Run** function every 10 minutes. Optionally a trigger that runs every time the spreadsheet opens. Click save.

5. Close the script editor and refresh the spreadsheet.

# Configuring cryptfolio

After importing the code and refreshing the spreadsheet you should see a sheet at the bottom named **Config**. Open it and provide your API keys and secrets where specified.

> All keys used with cryptfolio should be readonly. Exchanges should offer a feature to do so but, if they do not, use at your own risk.

## Configuring Bittrex

1. Login to you bittrex account
2. Click **Settings** from the top nav
3. Click **API Keys** on the left of the page.
4. Click **Add New Key** and click the slider so that **READ INFO** says **ON**.
5. Enter your 2FA **Authenticator Code** and click **Update Keys**
6. Copy your API key and secret to the **Config** sheet.

## Configuring Binance

1. Login to you binance account
2. From the binance account page click **API Setting**
3. Give the key a name (e.g. Cryptfolio) and click **Create New Key**.
4. Edit the key so that only **Read Info** is checked if necessary.
5. Copy the API key and secret to the **Config** sheet.

# Features

1. Binance account support
2. Bittrex account support
3. CoinMarketCap support
4. Unified portolfio dashboard for N many exchanges.
5. Historical portfolio data for further use.

**Coming soon**

1. Coinbase
2. Full spreadsheet backups
3. Trade tracking

**Coming next**
4. Cost basis
5. Taxes?

# CONTRIBUTING

If you find this useful please contribute back new features. Open a PR and I'll pull it in.