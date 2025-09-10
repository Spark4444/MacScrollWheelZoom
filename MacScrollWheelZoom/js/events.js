// Function to update the zoom level for the current website
function updateValueOfCurrentWebsiteZoom() {
    getFromChromeStorage('websiteLevels', (storedValues) => {
      if (storedValues[currentOrigin] !== currentZoomIndex) {
        const updatedValues = { ...storedValues, [currentOrigin]: currentZoomIndex };
        saveToChromeStorage('websiteLevels', updatedValues);
      }
    });
}

// Save the current zoom index before the page dies or is refreshed
window.addEventListener('beforeunload', () => {
  updateValueOfCurrentWebsiteZoom();
});

// Also save when the page visibility changes (e.g., switching tabs)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    updateValueOfCurrentWebsiteZoom();
  }
});

// Listen for changes in Chrome storage to sync zoom level across tabs
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.websiteLevels) {
    const newValue = findValueOfTheCurrentWebsite(changes.websiteLevels.newValue, resetZoom);
    if (newValue !== currentZoomIndex) {
      currentZoomIndex = newValue;
      updateZoom();
      updateOverlay();
    }
  }
});