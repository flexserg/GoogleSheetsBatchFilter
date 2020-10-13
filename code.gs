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
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId();
  var dataSheet = ss.getActiveSheet();
  var lastRow = dataSheet.getLastRow();
  var lastColumn = dataSheet.getLastColumn();
  var sheetId = dataSheet.getSheetId();
  
  var setCol = "A";
  
  //Find Column Index by Column Letters
  var sheet = ss.getSheets()[0];
  var range = sheet.getRange(setCol + "1");
  var setColIndex = range.getColumn() - 1;
  
  //Get text from input in HTML form and split it by lines
  var ks = str.split("\n");
 
  //Build formula like this "=(BU:BU="89650322371")+(BU:BU="89817073385")+..."
  var text = '=($' + setCol + ':$' + setCol + '="';
  var i;
  for (i = 0; i < ks.length - 1; i++) {
    text += ks[i] + '")+($' + setCol + ':$' + setCol + '="';
  }  
  text += ks[ks.length - 1] + '")';  
  //SpreadsheetApp.getUi().alert(text);
  
  //Set filter
  var filterSettings = {};
  
  filterSettings.range = {
    "sheetId": sheetId,
    "startRowIndex": 1,
    "endRowIndex": lastRow,
    "startColumnIndex": 0,
    "endColumnIndex": lastColumn
  };
 
  var filterCriteria = {
    "type":"CUSTOM_FORMULA",
    "values": [
      {
        "userEnteredValue": text
      }
    ]
  };
  
  filterSettings.criteria = {};
  filterSettings['criteria'][setColIndex] = {
    'condition': filterCriteria
  };
  
  var requests = [{
    "setBasicFilter": {
      "filter": filterSettings
    }
  }];

  Sheets.Spreadsheets.batchUpdate({'requests': requests}, ssId);
}


function resetFilter() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId();
  var dataSheet = ss.getActiveSheet();
  var lastRow = dataSheet.getLastRow();
  var lastColumn = dataSheet.getLastColumn();
  var sheetId = dataSheet.getSheetId();
  
  //Reset filter
  var filterSettings = {
    "range": {
      "sheetId": sheetId,
      "startRowIndex": 1,
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
