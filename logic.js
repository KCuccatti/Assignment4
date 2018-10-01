$(document).ready(function(){

  const stockList = [];

    let stockImg;
    let stockCompanyName; 
    let stockSymbol;
    let stockLatestPrice;
    const validationList = ajaxGetAllStockSymbols();
   

  $('#btnSubmit').on('click', function(){
   
    // When 'submit' is clicked, clear out the text box. 
    $('#stockInfo').empty();


    event.preventDefault();
    stockSymbol = $('#stockInfo').val();
    const queryURL = `https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`;
    const queryLogo = `https://api.iextrading.com/1.0/stock/${stockSymbol}/logo`;
    const queryAllSymbols = `https://api.iextrading.com/1.0/ref-data/symbols`;

    

    // Check to see if symbol exists in validationList array. 
    if(!contains(validationList.responseJSON, "symbol", stockSymbol)) { 
      alert("Stock symbol was not found.");
      $('#stockInfo').val("");
      return;
      
    }


    $.when(ajaxGetStockInfo(), ajaxGetStockLogo()).done(function(a1, a2){
      let newStockBtn = $('#stockInfo').val().trim();
      stockList.push(newStockBtn);
      $('#btnArr').append(`<input id=${newStockBtn} type='button' value=${newStockBtn} </input>`);

      $('#tBody').append(`<tr><td> ${stockCompanyName} </td><td> ${stockSymbol} 
          </td><td> ${stockLatestPrice} </td> <td><img src="${stockImg}" height="50"/></td></tr>`)
          $('#stockInfo').val('');
      });
  });

  // Gets the stock symbol from the API 
  function ajaxGetAllStockSymbols() {
    return $.ajax({
      type: "GET",
      url: `https://api.iextrading.com/1.0/ref-data/symbols`,
      datatype: "json",
      success: getAllStockSymbols,
    });
  }


  // Grabs the stock information from the API 
  function ajaxGetStockInfo() {
    return $.ajax({
      type: "GET",
      url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/quote`,
      datatype: "json",
      success: getStockInfo,
    });
  }

  // Grabs the stock logo from the API 
  function ajaxGetStockLogo() {
    return $.ajax({
      type: "GET",
      url: `https://api.iextrading.com/1.0/stock/${stockSymbol}/logo`,
      datatype: "json",
      success: getStockLogo,
    });
  }


  function getAllStockSymbols(response) {
    return response;
  }
  
  // Gets the stock information from the assigned variables
  function getStockInfo(response) {
    stockCompanyName = response.companyName;
    stockSymbol = response.symbol;
    stockLatestPrice = response.latestPrice;
  }
  
  // Gets stock logo from assigned variable
    function getStockLogo (response) {
      stockImg = response.url;
  }
  

  // CHECK TO SEE IF THE ARRAY CONTAINS A GIVEN VALUE FOR A PARTICULAR KEY
    function contains(arr, key, val) {
      for (let i=0; i < arr.length; i++) {
        if (arr[i].symbol == val.toUpperCase()) {
          return true;
      }
    }
    return false;
  }


  // Clears the table of stock information when 'clear' is clicked
    $('#clear').on('click', function() {
      ('#tBody').empty();
  })

})

