const getSearchCriteria = () => {
  try {
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty("CRITERIA_SPREADSHEET_ID");
    if (!spreadsheetId) {
      Logger.warning("No spreadsheet ID found in Script Properties");
      return getDefaultCriteria();
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("SearchCriteria");
    if (!sheet) {
      Logger.warning("Could not find SearchCriteria sheet");
      return getDefaultCriteria();
    }

    // Get all data including category and active status
    const data = sheet.getRange("A2:C" + sheet.getLastRow()).getValues();
    
    // Filter for active criteria only
    const criteria = data
      .filter(row => row[2] === true || row[2] === "TRUE") // Only active criteria
      .map(row => row[0]) // Get just the search criteria
      .filter(criteria => criteria !== "");

    Logger.info(`Loaded ${criteria.length} active search criteria from spreadsheet`);
    return criteria;

  } catch (e) {
    Logger.warning("Error fetching criteria from spreadsheet: " + e.toString());
    return getDefaultCriteria();
  }
};

const getDefaultCriteria = () => {
  // Fallback for development/testing
  return [
    "label:test-label"
  ];
}; 

// Export for testing while maintaining GAS global scope
if (typeof module !== "undefined" && module.exports) {
  module.exports = { getSearchCriteria };
} else {
  // In GAS environment, make function global
  this.getSearchCriteria = getSearchCriteria;
} 