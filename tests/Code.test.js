const { batchDeleteEmail, deleteThreads } = require('../src/Code.js');

describe('batchDeleteEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should process emails correctly', () => {
    // Mock a thread
    const mockThread = {
      moveToTrash: jest.fn(),
      getId: jest.fn().mockReturnValue('123')
    };

    // Mock GmailApp.search to return our mock thread
    GmailApp.search.mockReturnValue([mockThread]);

    // Mock spreadsheet response
    const mockSheet = {
      getRange: jest.fn().mockReturnValue({
        getValues: jest.fn().mockReturnValue([
          ['label:test', 'Test Label', true]
        ])
      }),
      getLastRow: jest.fn().mockReturnValue(2)
    };

    SpreadsheetApp.openById.mockReturnValue({
      getSheetByName: jest.fn().mockReturnValue(mockSheet)
    });

    PropertiesService.getScriptProperties().getProperty.mockReturnValue('mock-sheet-id');

    // Run the function
    const result = batchDeleteEmail();

    // Verify the results
    expect(result).toBe(1); // One thread processed
    expect(mockThread.moveToTrash).toHaveBeenCalled();
    expect(Logger.info).toHaveBeenCalled();
  });

  test('should handle errors gracefully', () => {
    // Mock a search error
    GmailApp.search.mockImplementation(() => {
      throw new Error('Search failed');
    });

    const result = batchDeleteEmail();
    
    expect(result).toBe(0);
    expect(Logger.severe).toHaveBeenCalled();
  });
});

describe('deleteThreads', () => {
  test('should delete all threads in batch', () => {
    const mockThreads = [
      { moveToTrash: jest.fn(), getId: jest.fn().mockReturnValue('1') },
      { moveToTrash: jest.fn(), getId: jest.fn().mockReturnValue('2') }
    ];

    deleteThreads(mockThreads);

    mockThreads.forEach(thread => {
      expect(thread.moveToTrash).toHaveBeenCalled();
    });
  });
});