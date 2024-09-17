class IdbCaloriesDB {
    constructor() {
      this.db = null;
    }
  
    // Open or create the IndexedDB database
    openCaloriesDB(dbName, version) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
  
        request.onupgradeneeded = (e) => {
          this.db = e.target.result;
        
          // Create object store if it doesn't exist
          if (!this.db.objectStoreNames.contains('calories')) {
            this.db.createObjectStore('calories', { keyPath: 'id', autoIncrement: true });
          }
        };
  
        request.onsuccess = (e) => {
          this.db = e.target.result;
          resolve(this); // Resolve the promise with this object
        };
  
        request.onerror = (e) => {
          // Reject promise if error occurs
          reject(`Error opening database: ${e.target.errorCode}`);
        };
      });
    }
  
    // Add a new calorie entry to the database
    addCalories(entry) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['calories'], 'readwrite');

        transaction.onerror = (event) => {
          console.log("error during Transaction ");
        };

      
        const store = transaction.objectStore('calories');
  
        // Add new entry
        const request = store.add(entry);
  
        request.onsuccess = () => {
          console.log("successfully added to store")
          resolve(true); // Resolve promise if successful
        };
  
        request.onerror = (e) => {
          reject(`Error adding entry: ${e.target.errorCode}`);
        };
      });
    }
  
    // Get calorie entries for a specific month and year
    getCaloriesForMonth(year, month) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['calories'], 'readonly');
        const store = transaction.objectStore('calories');
        const request = store.getAll(); // Get all entries from the store
        let results = [];
  
        request.onsuccess = (e) => {
          const data = e.target.result;
  
          // Filter entries by month and year
          results = data.filter(item => {
            const date = new Date(item.date);
            return date.getFullYear() === year && date.getMonth() +1 === month;
          });
  
          resolve(results); // Resolve with the filtered results
        };
  
        request.onerror = (e) => {
          reject(`Error retrieving data: ${e.target.errorCode}`);
        };
      });
    }
  }
  
  // Create an instance of the database class
  const idb = new IdbCaloriesDB();
  
