const { getSearchCriteria, createCustomTrigger } = require('../src/config.js');

describe('getSearchCriteria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return criteria from spreadsheet when available', () => {
    // Mock sheet data
    const mockSheet = {
      getRange: jest.fn().mockReturnValue({
        getValues: jest.fn().mockReturnValue([
          ['label:test', 'Test Label', true],
          ['older_than:7d', 'Week old', true],
          ['from:*@example.com', 'Example emails', false],
          ['', 'Empty row', true]
        ])
      }),
      getLastRow: jest.fn().mockReturnValue(5)
    };

    // Mock spreadsheet
    SpreadsheetApp.openById.mockReturnValue({
      getSheetByName: jest.fn().mockReturnValue(mockSheet)
    });

    // Mock property service
    PropertiesService.getScriptProperties().getProperty.mockReturnValue('mock-sheet-id');

    const result = getSearchCriteria();

    // Should only return active, non-empty criteria
    expect(result).toEqual(['label:test', 'older_than:7d']);
    expect(Logger.info).toHaveBeenCalledWith('Loaded 2 active search criteria from spreadsheet');
  });

  test('should return default criteria when spreadsheet ID is missing', () => {
    PropertiesService.getScriptProperties().getProperty.mockReturnValue(null);

    const result = getSearchCriteria();

    expect(result).toEqual(['label:test-label']);
    expect(Logger.warning).toHaveBeenCalledWith('No spreadsheet ID found in Script Properties');
  });

  test('should return default criteria when sheet is not found', () => {
    PropertiesService.getScriptProperties().getProperty.mockReturnValue('mock-sheet-id');
    
    SpreadsheetApp.openById.mockReturnValue({
      getSheetByName: jest.fn().mockReturnValue(null)
    });

    const result = getSearchCriteria();

    expect(result).toEqual(['label:test-label']);
    expect(Logger.warning).toHaveBeenCalledWith('Could not find SearchCriteria sheet');
  });

  test('should handle spreadsheet errors gracefully', () => {
    PropertiesService.getScriptProperties().getProperty.mockReturnValue('mock-sheet-id');
    
    SpreadsheetApp.openById.mockImplementation(() => {
      throw new Error('Failed to open spreadsheet');
    });

    const result = getSearchCriteria();

    expect(result).toEqual(['label:test-label']);
    expect(Logger.warning).toHaveBeenCalledWith(expect.stringContaining('Error fetching criteria from spreadsheet'));
  });
});

describe('createCustomTrigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete existing triggers and create new one', () => {
    // Mock existing triggers
    const mockTrigger = {
      getHandlerFunction: jest.fn().mockReturnValue('batchDeleteEmail'),
    };
    ScriptApp.getProjectTriggers.mockReturnValue([mockTrigger]);
    
    // Mock trigger builder
    const mockBuilder = {
      timeBased: jest.fn().mockReturnThis(),
      everyDays: jest.fn().mockReturnThis(),
      atHour: jest.fn().mockReturnThis(),
      create: jest.fn()
    };
    ScriptApp.newTrigger.mockReturnValue(mockBuilder);

    createCustomTrigger();

    // Should delete existing trigger
    expect(ScriptApp.deleteTrigger).toHaveBeenCalled();

    // Should create new trigger
    expect(ScriptApp.newTrigger).toHaveBeenCalledWith('batchDeleteEmail');
    expect(mockBuilder.timeBased).toHaveBeenCalled();
    expect(mockBuilder.everyDays).toHaveBeenCalledWith(1);
    expect(mockBuilder.atHour).toHaveBeenCalledWith(2);
    expect(mockBuilder.create).toHaveBeenCalled();
    
    expect(Logger.info).toHaveBeenCalledWith('Daily trigger created for batchDeleteEmail');
  });

  test('should handle case with no existing triggers', () => {
    ScriptApp.getProjectTriggers.mockReturnValue([]);
    
    const mockBuilder = {
      timeBased: jest.fn().mockReturnThis(),
      everyDays: jest.fn().mockReturnThis(),
      atHour: jest.fn().mockReturnThis(),
      create: jest.fn()
    };
    ScriptApp.newTrigger.mockReturnValue(mockBuilder);

    createCustomTrigger();

    // Should not try to delete any triggers
    expect(ScriptApp.deleteTrigger).not.toHaveBeenCalled();

    // Should still create new trigger
    expect(mockBuilder.create).toHaveBeenCalled();
  });
});
