/**
 * Maximum number of threads to process in a single batch
 * @constant {number}
 */
const MAX_BATCH_SIZE = 500;

/**
 * Deletes emails in batches based on search criteria
 * @returns {number} Total number of threads deleted
 */
const batchDeleteEmail = () => {
  try {
    const criteria = getSearchCriteria();
    const threadBatches = collectThreadBatches(criteria);
    return deleteAllThreadBatches(threadBatches);
  } catch (error) {
    Logger.severe(`Failed to process email deletion: ${error.toString()}`);
    return 0;
  }
};

/**
 * Collects threads into batches based on search criteria
 * @param {string[]} criteria - Array of search criteria
 * @returns {Array<GmailThread[]>} Array of thread batches
 */
const collectThreadBatches = (criteria) => {
  const batches = [[]];
  let currentBatchIndex = 0;

  criteria.forEach(searchCriteria => {
    try {
      const foundThreads = searchThreads(searchCriteria);
      batches[currentBatchIndex] = batches[currentBatchIndex].concat(foundThreads);

      if (batches[currentBatchIndex].length > MAX_BATCH_SIZE) {
        currentBatchIndex++;
        batches[currentBatchIndex] = [];
      }
    } catch (error) {
      Logger.severe(`Error processing criteria "${searchCriteria}": ${error.toString()}`);
    }
  });

  return batches;
};

/**
 * Searches for threads matching the given criteria
 * @param {string} criteria - Search criteria
 * @returns {GmailThread[]} Array of found threads
 */
const searchThreads = (criteria) => {
  Logger.info(`Finding threads matching: ${criteria}`);
  const foundThreads = GmailApp.search(criteria);
  Logger.info(`Found ${foundThreads.length} threads`);
  return foundThreads;
};

/**
 * Deletes all threads in the given batches
 * @param {Array<GmailThread[]>} threadBatches - Array of thread batches
 * @returns {number} Total number of threads deleted
 */
const deleteAllThreadBatches = (threadBatches) => {
  let totalThreads = 0;

  threadBatches.forEach(batch => {
    deleteThreads(batch);
    totalThreads += batch.length;
  });

  Logger.log(`Total Number of Threads Deleted: ${totalThreads}`);
  return totalThreads;
};

/**
 * Deletes a batch of threads
 * @param {GmailThread[]} threads - Array of threads to delete
 */
const deleteThreads = (threads) => {
  threads.forEach(thread => {
    try {
      thread.moveToTrash();
      Logger.info(`Deleted thread: ${thread.getId()}`);
    } catch (error) {
      Logger.severe(`Failed to delete thread ${thread.getId()}: ${error.toString()}`);
    }
  });
};

// Export for testing while maintaining GAS global scope
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    batchDeleteEmail,
    deleteThreads,
    // Export internal functions for testing
    collectThreadBatches,
    searchThreads,
    deleteAllThreadBatches
  };
} else {
  // In GAS environment, make function global
  this.batchDeleteEmail = batchDeleteEmail;
}
