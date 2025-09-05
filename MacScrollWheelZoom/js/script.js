const zoomLevels = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];

// Function to save data to Chrome storage
function saveToChromeStorage(key, value) {
    chrome.storage.sync.set({[key]: value});
}

// Function to get data from Chrome storage
function getFromChromeStorage(key, callback) {
    chrome.storage.sync.get([key], function(result) {
        callback(result[key]);
    });
}

// Checks if a chrome storage value is set
function checkIfValueIsValidZoomIndex(value, defaultValue){
    if(value === undefined || value === null || isNaN(value) || value < 0 || value >= zoomLevels.length){
        return defaultValue;
    }
    else{
        return value;
    }
}


// Initialize current zoom index
let currentZoomIndex = zoomLevels.indexOf(100);

// Load saved zoom index from Chrome storage so that zoom is persistent across sessions
getFromChromeStorage("currentZoomIndex", (value) => {
    // Zoom parameters
    const resetZoom = 100;
    const zoomFactor = 25;
    const overlay = `<div class="zoomOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 9999;"></div>`;
    currentZoomIndex = checkIfValueIsValidZoomIndex(value, resetZoom);

    document.addEventListener("wheel", (event) => {
        // Check if the Ctrl key is pressed (Cmd key on Mac)
        if (event.ctrlKey) {
            event.preventDefault();
            // Determine zoom direction based on scroll direction
            const zoomIndexIncrease = event.deltaY > 0 ? -1 : 1;
            currentZoomIndex += zoomIndexIncrease;

            // Clamp the zoom index to valid ranges
            if (currentZoomIndex < 0) currentZoomIndex = 0;
            if (currentZoomIndex >= zoomLevels.length) currentZoomIndex = zoomLevels.length - 1;

            // Apply the zoom level
            document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
        }
        
    // Use passive to prevent errors if installed on windows machines
    }, { passive: false });

    // Reset, increase, decrease zoom level functions for overlay buttons
    function resetZoomLevel() {
        currentZoomIndex = zoomLevels.indexOf(resetZoom);
        document.body.style.zoom = `${resetZoom}%`;
        saveToChromeStorage("currentZoomIndex", currentZoomIndex);
    }

    function increaseZoomLevel() {
        if (currentZoomIndex < zoomLevels.length - 1) {
            currentZoomIndex++;
            document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
            saveToChromeStorage("currentZoomIndex", currentZoomIndex);
        }
    }

    function decreaseZoomLevel() {
        if (currentZoomIndex > 0) {
            currentZoomIndex--;
            document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
            saveToChromeStorage("currentZoomIndex", currentZoomIndex);
        }
    }
});

// Save the current zoom index before the page dies or is refreshed
window.addEventListener("beforeunload", () => {
    saveToChromeStorage("currentZoomIndex", currentZoomIndex);
});