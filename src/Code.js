const criteria = [];

const batchDeleteEmail = () => {
  let totalThreads = 0; // total threads delete. for logging purposes.

  let threads = [[]]; // batches of threads.
  let threadBatch = 0; // current batch number.
  for (let i = 0; i < criteria.length; i++) {
    console.info("Finding threads matching:" + criteria[i]);
    
    let foundThreads;
    try {
      foundThreads = GmailApp.search(criteria[i]);
    } catch (e) {
      console.error(e);
      continue;
    }
    console.info("Found " + foundThreads.length + " threads");
   
    threads[threadBatch] = threads[threadBatch].concat(foundThreads);
    console.log("Total matching threads: ", threads[threadBatch].length);
    
    if (threads.length > 500) { // I don't remember why...
      threadBatch++;
      threads[threadBatch] = []; // initialize the next batch, otherwise the blind 'concat' (above) won't work.
    }
  }

  for (let i = 0; i < threads.length; i++) {
    deleteThreads(threads[i]);
    totalThreads += threads[i].length;
  }
  
  console.log("Total Number of Threads Deleted: " + totalThreads);
};

const deleteThreads = (threads) => {
  const threadCount = threads.length;
  
  for (let i = 0; i < threadCount; i++) {
      threads[i].moveToTrash();
      console.info("Deleted: " + threads[i].getId());
  }
};
