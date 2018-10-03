$(document).ready(function () {
  const stockList = [];

  let stockImg;
  var stockNews = [];
  var stockData = [];
  var stockLogo = [];

  // Hold onto the list of stocks the user is interested in following
  const validationList = ajaxGetAllStockSymbols();

  // When a user clicks on one of the stock butons, the stock information is obtained from memory
  $('#btnArr').on('click', 'button', function () {
    displayStockFromMemory(this.id);
  });

  $('#btnSubmit').on('click', function () {

    // Each time the user requests info on a stock, the previous contents are removed from screen
    $('#tBody').empty();

    event.preventDefault();
    stockSymbol = $('#stockInfo').val();

    // Check to see if symbol exists in validationList array. 
    // TODO: CHANGE ALERT TO DIV TAG  
    if (!contains(validationList.responseJSON, "symbol", stockSymbol)) {
      alert("Stock symbol was not found.");
      $('#stockInfo').val("");
      return;
    }

    $.when(ajaxGetStockInfo(), ajaxGetStockLogo(), ajaxGetStockNews()).done(function (a1, a2, a3) {

      if (stockList.includes($('#stockInfo').val())) {
        // Stock Info was already retreived from previous calls so obtain from memory.
        displayStockFromMemory($('#stockInfo').val());
      }
      else {
        // Use the stock info that was obtained from ajax calls
        let newStockBtn = $('#stockInfo').val().trim();
        $('#tBody').empty();
        stockList.push(newStockBtn);
        $('#btnArr').append(`<button id="${newStockBtn}" class="stock-button">${stockSymbol}</button>`);

        for (let i = 0; i < stockData.length; i++) {
          if (stockData[i].stockSymbol == stockSymbol) {
            $('#tBody').append(`<tr><td>${stockData[i].stockCompanyName}</td><td>${stockData[i].stockSymbol} 
                        </td><td>${stockData[i].stockLatestPrice}</td><td><img src="${stockLogo[i].stockImg}" height="50"/></td></tr>`)
          }
        }

        // Append to the tbody just the news from the stockNews json for the stock being viewed.
        for (let i = 0; i < stockNews.length; i++) {
          if (stockNews[i].stockSymbol == stockSymbol) {
            $('#tBody').append(`<tr><td colspan="4"><a href="${stockNews[i].url}" target="new">${stockNews[i].headline}</a></td></tr>`);
          }
        }
      }
      $('#stockInfo').val('');

    });

  })

  // Gets the list of valid stocks from the API if information is not already present in memory
  function ajaxGetAllStockSymbols() {
    if (stockList.length == 0) {
      return $.ajax({
        type: "GET",
        url: `https://api.iextrading.com/1.0/ref-data/symbols`,
        datatype: "json",
        success: getAllStockSymbols,
      });
    }
  }

  // Gets the stock information from the API  if information is not already present in memory
  function ajaxGetStockInfo() {
    if (!dataAlreadyInList(stockSymbol)) {
      return $.ajax({
        type: "GET",
        url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`,
        datatype: "json",
        success: getStockInfo,
      });
    }
  }

  // Gets the stock news quotes from the API if information is not already present in memory 
  function ajaxGetStockNews() {
    if (!dataAlreadyInList(stockSymbol)) {
      return $.ajax({
        type: "GET",
        url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=quote,news&range=1m&last=10`,
        datatype: "json",
        success: getStockNews,
      });
    }
  }

  // Gets the stock logo from the API if not already present in memory
  function ajaxGetStockLogo() {
    if (!dataAlreadyInList(stockSymbol)) {
      return $.ajax({
        type: "GET",
        url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/logo`,
        datatype: "json",
        success: getStockLogo,
      });
    }
  }

  // Gets stock symbols from API 
  function getAllStockSymbols(response) {
    return response;
  }

  // Only add stock information to the array if it has not already been previously fetched.
  function getStockInfo(response) {
    let found = false;
    for (let i = 0; i < stockData.length; i++) {
      if (stockData[i].stockSymbol == stockSymbol) {
        found = true;
        break;
      }
    }
    if (!found) {
      stockData.push({ stockSymbol: stockSymbol, stockCompanyName: response.companyName, stockLatestPrice: response.latestPrice });
    }
  }

  // Add the first three news headlines for the selected stock
  function getStockNews(response) {
      for (let i = 0; i < 3; i++) {
        let headline = response.news[i].headline;
        let url = response.news[i].url;
        stockNews.push({ stockSymbol: stockSymbol, headline: headline, url: url });
      }
    return stockNews;
  }


  // Assigns stockImg to the img url in the API 
  function getStockLogo(response) {
    stockLogo.push({ stockImg: response.url });
  }

  // Check to see if the array contains a given value for a particular key
  function contains(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].symbol == val.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  function dataAlreadyInList(id) {
    return stockList.includes(id);
  }

  // Display all information about a stock from memory
  function displayStockFromMemory(stockSymbol) {

    $('#tBody').empty();

    for (let i = 0; i < stockData.length; i++) {
      if (stockData[i].stockSymbol == stockSymbol) {
        $('#tBody').append(`<tr><td>${stockData[i].stockCompanyName}</td><td>${stockData[i].stockSymbol} 
                    </td><td>${stockData[i].stockLatestPrice}</td><td><img src="${stockLogo[i].stockImg}" height="50"/></td></tr>`)
      }
    }

    // Append to the tbody just the news from the stockNews json for the stock being viewed.
    for (let i = 0; i < stockNews.length; i++) {
      if (stockNews[i].stockSymbol == stockSymbol) {
        $('#tBody').append(`<tr><td colspan="4"><a href="${stockNews[i].url}" target="new">${stockNews[i].headline}</a></td></tr>`);
      }
    }
  }

})