//--GLOBALS--
 
var ui = SpreadsheetApp.getUi();


function onOpen(e){
  // Create menu options
  ui.createAddonMenu()
      .addItem("setFilter","form")
      .addItem("resetFilter","resetFilter")
    .addToUi();
};


function form(){ 
  //Call the HTML file and set the width and height
  var html = HtmlService.createHtmlOutputFromFile("formUI")
    .setWidth(450)
    .setHeight(300);
  
  //Display the dialog
  var dialog = ui.showModalDialog(html, "Вставьте данные");
 
};


function setFilter(str) {
//  var sss = SpreadsheetApp.openById("1YF3qa5G2xMC-ayBABVn0xidZjwwCQzoOnWLDA8ONjJk");
  
//  var ss = sss.getSheetByName("Form")
      
//  var Avals = ss.getRange("B1:B").getValues();
//  var row = Avals.filter(String).length;
//  var col = 2;
//  var str = ss.getRange(row, col).getValue();
  SpreadsheetApp.getUi().alert(str);
  var ks = str.split("\n");
  var text = '=OR(B1="';
  
  var i;
  for (i = 0; i < ks.length - 1; i++) {
    text += ks[i] + '",B1="';
  }
  
  text += ks[ks.length - 1] + '")';
  SpreadsheetApp.getUi().alert(text);  
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var filterCriteria = {
    "type":"CUSTOM_FORMULA",
    "values": {'userEnteredValue': text
    }
  };
  
  var filterSettings = {};
  
  // The range of data on which you want to apply the filter.
  // optional arguments: startRowIndex, startColumnIndex, endRowIndex, endColumnIndex
  filterSettings.range = {
    sheetId: ss.getActiveSheet().getSheetId()
  };

  // Criteria for showing/hiding rows in a filter
  // https://developers.google.com/sheets/api/reference/rest/v4/FilterCriteria
  filterSettings.criteria = {};
  var columnIndex = 0;
  filterSettings['criteria'][columnIndex] = {
    'condition': filterCriteria
  };

  var request = {
    "setBasicFilter": {
      "filter": filterSettings
    }
  };
  Sheets.Spreadsheets.batchUpdate({'requests': [request]}, ss.getId());
}


function resetFilter() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId();
  var dataSheet = ss.getActiveSheet();
  var lastRow = dataSheet.getLastRow();
  var lastColumn = dataSheet.getLastColumn();
  var sheetId = dataSheet.getSheetId();
  
  var filterSettings = {
    "range": {
      "sheetId": sheetId,
      "startRowIndex": 0,
      "endRowIndex": lastRow,
      "startColumnIndex": 0,
      "endColumnIndex": lastColumn
    }
  };
  var requests = [{
    "setBasicFilter": {
      "filter": filterSettings
    }
  }];
  Sheets.Spreadsheets.batchUpdate({'requests': requests}, ssId);
}
