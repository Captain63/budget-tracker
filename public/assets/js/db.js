let db;

// Create request for new indexedDB database
const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = async (event) => {
    db = event.target.result;
  
    // Create object store called "BudgetStore" and set autoIncrement to true
    const BudgetStore = await db.createObjectStore("BudgetStore", { autoIncrement:true });
};
  
request.onsuccess = event => {
    db = event.target.result;
  
    if (navigator.onLine) {
      checkDatabase();
    }
};
  
request.onerror = event => {
    console.error(event);
};
  
function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    // access your pending object store
    // add record to your store with add method.
    db = request.result;
    const transaction = db.transaction(["BudgetStore"], "readwrite");
    const BudgetStore = transaction.objectStore("BudgetStore");
  
    BudgetStore.add(record);
}
  
function checkDatabase() {
    // open a transaction on your pending db
    // access your pending object store
    // get all records from store and set to a variable
    db = request.result;
    const transaction = db.transaction(["BudgetStore"], "readonly");
    const BudgetStore = transaction.objectStore("BudgetStore");
  
    const getAll = BudgetStore.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then(() => {
            // if successful, open a transaction on your pending db
            // access your pending object store
            // clear all items in your store
            const transaction = db.transaction(["BudgetStore"], "readwrite");
            const BudgetStore = transaction.objectStore("BudgetStore");
            BudgetStore.clear();
          });
        }
    };
}
  
  // Add listener to check network connection of app
  window.addEventListener('online', checkDatabase);
