// Function to save data to Chrome storage
function saveToChromeStorage(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

// Function to get data from Chrome storage
function getFromChromeStorage(key, callback) {
  chrome.storage.sync.get([key], function (result) {
    callback(result[key]);
  });
}

// Function to find the value for the current website from stored values
function findValueOfTheCurrentWebsite(storedValues, defaultValue) {
  if (storedValues && typeof storedValues === 'object') {
    return storedValues[currentOrigin] ?? defaultValue;
  }
  return defaultValue;
}