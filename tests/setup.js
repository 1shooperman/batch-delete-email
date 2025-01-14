// Mock GAS global services
global.Logger = {
  log: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  severe: jest.fn()
};

global.SpreadsheetApp = {
  openById: jest.fn()
};

global.GmailApp = {
  search: jest.fn()
};

global.PropertiesService = {
  getScriptProperties: jest.fn().mockReturnValue({
    getProperty: jest.fn()
  })
};

// Load and expose GAS functions globally
const { getSearchCriteria } = require('../src/config.js');
const { batchDeleteEmail } = require('../src/Code.js');

global.getSearchCriteria = getSearchCriteria;
global.batchDeleteEmail = batchDeleteEmail; 