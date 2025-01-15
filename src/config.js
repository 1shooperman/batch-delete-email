/**
 * Retrieves search criteria from a Google Sheet
 * @returns {string[]} Array of search criteria strings
 * @throws {Error} If there's an issue accessing the spreadsheet
 */
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

/**
 * Provides default search criteria when spreadsheet access fails
 * @returns {string[]} Array of default search criteria
 */
const getDefaultCriteria = () => {
  // Fallback for development/testing
  return [
    "label:test-label"
  ];
}; 

/**
 * Creates a time-based trigger to run batchDeleteEmail daily
 * @description Sets up a trigger to run batchDeleteEmail at 2 AM daily.
 * Removes any existing triggers for batchDeleteEmail before creating a new one.
 * @throws {Error} If there's an issue creating the trigger
 */
const createCustomTrigger = () => {
  // Delete existing triggers first to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "batchDeleteEmail") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new daily trigger
  ScriptApp.newTrigger("batchDeleteEmail")
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
  
  Logger.info("Daily trigger created for batchDeleteEmail");
};

// Export for testing while maintaining GAS global scope
if (typeof module !== "undefined" && module.exports) {
  module.exports = { getSearchCriteria, createCustomTrigger };
} else {
  // In GAS environment, make function global
  this.getSearchCriteria = getSearchCriteria;
  this.createCustomTrigger = createCustomTrigger;
} 