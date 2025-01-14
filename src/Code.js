if (typeof require !== 'undefined') {
  var { getSearchCriteria } = require('./config.js');
}

const batchDeleteEmail = () => {
  const criteria = getSearchCriteria();
  let totalThreads = 0;
  
  let threads = [[]];
  let threadBatch = 0;

  for (let i = 0; i < criteria.length; i++) {
    Logger.info("Finding threads matching: " + criteria[i]);
    
    let foundThreads;
    try {
      foundThreads = GmailApp.search(criteria[i]);
    } catch (e) {
      Logger.severe("Error searching for threads: " + e.toString());
      continue;
    }
    Logger.info("Found " + foundThreads.length + " threads");
   
    threads[threadBatch] = threads[threadBatch].concat(foundThreads);
    Logger.log("Total matching threads: " + threads[threadBatch].length);
    
    if (threads.length > 500) {
      threadBatch++;
      threads[threadBatch] = []; // initialize the next batch, otherwise the blind 'concat' (above) won't work.
    }
  }

  for (let i = 0; i < threads.length; i++) {
    deleteThreads(threads[i]);
    totalThreads += threads[i].length;
  }
  
  Logger.log("Total Number of Threads Deleted: " + totalThreads);

  return totalThreads;
};

const deleteThreads = (threads) => {
  const threadCount = threads.length;
  
  for (let i = 0; i < threadCount; i++) {
      threads[i].moveToTrash();
      Logger.info("Deleted thread: " + threads[i].getId());
  }
};

// Export for testing while maintaining GAS global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { batchDeleteEmail, deleteThreads };
} else {
  // In GAS environment, make function global
  this.batchDeleteEmail = batchDeleteEmail;
}
