const zoomLevels = [
  25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
];
const currentOrigin = window.location.origin;

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
    return storedValues[currentOrigin] || defaultValue;
  }
  return defaultValue;
}

// Detect color scheme
const currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const greyColor = currentMode === 'dark' ? '#b9b9b9' : '#5f5f5f';
// Initialize current zoom index
let currentZoomIndex = zoomLevels.indexOf(100);
const resetZoom = currentZoomIndex;

// Functions to set and reset button greyed out state
function setButtonGrey(index) {
  const buttons = document.querySelectorAll('.signButton');
  if (buttons[index]) {
    const currentButton = buttons[index];
    currentButton.style.color = greyColor;
    currentButton.style.cursor = 'auto';
  }
}

function resetButton(index) {
  const buttons = document.querySelectorAll('.signButton');
  if (buttons[index]) {
    const currentButton = buttons[index];
    currentButton.style.color = '';
    currentButton.style.cursor = 'pointer';
  }
}

function resetAllButtons() {
  const buttons = document.querySelectorAll('.signButton');
  buttons.forEach((button) => {
    button.style.color = '';
    button.style.cursor = 'pointer';
  });
}

// Functions to set and reset button greyed out state
function updateButtonStyles() {
  if (currentZoomIndex <= 0) {
    setButtonGrey(0);
    resetButton(1);
  }
  else if (currentZoomIndex >= zoomLevels.length - 1) {
    setButtonGrey(1);
    resetButton(0);
  }
  else {
    resetAllButtons();
  }
}

// Function to update zoom counter display
function updateZoomCounter() {
  const zoomCounter = document.querySelector('.zoomCounter');
  if (zoomCounter) {
    zoomCounter.textContent = `${zoomLevels[currentZoomIndex]}%`;
  }
}

// Function to update overlay scale to counteract zoom
function updateOverlayScale() {
  // Convert percentage to decimal
  const currentZoom = zoomLevels[currentZoomIndex] / 100;
  // Calculate inverse scale
  const inverseScale = 1 / currentZoom;
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    overlay.style.transform = `scale(${inverseScale})`;
  }
}

function updateZoom() {
  document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
}

function updateOverlay() {
  updateOverlayScale();
  updateButtonStyles();
  updateZoomCounter();
}

// Reset, increase, decrease zoom level functions for overlay buttons
function resetZoomLevel() {
  currentZoomIndex = resetZoom;
  document.body.style.zoom = `${resetZoom}%`;
  updateOverlay();
  saveToChromeStorage('currentZoomIndex', currentZoomIndex);
}

function increaseZoomLevel() {
  if (currentZoomIndex < zoomLevels.length - 1) {
    currentZoomIndex++;
    document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
    updateOverlay();
    saveToChromeStorage('currentZoomIndex', currentZoomIndex);
  }
}

function decreaseZoomLevel() {
  if (currentZoomIndex > 0) {
    currentZoomIndex--;
    document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
    updateOverlay();
    saveToChromeStorage('currentZoomIndex', currentZoomIndex);
  }
}

// Inject CSS styles dynamically
function injectOverlayStyles() {
  if (document.querySelector('#zoom-overlay-styles')) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.id = 'zoom-overlay-styles';
  style.textContent = `
    .zoomOverlay {
      position: fixed;
      top: 0;
      right: 32%;
      background: ${currentMode ? '#1f1f1f' : '#fff'};
      color: ${currentMode ? '#c7c7c7' : '#000'};
      padding: 0 17px;
      border-radius: 16px;
      z-index: 10000;
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 220px;
      height: 50px;
      font-family: helvetica;
      justify-content: space-between;
      font-size: 13px;
      transform-origin: top right;
      box-shadow: 0 4px 8px #0000004d;
    }
    
    .zoomOverlay .rightWrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 128px;
    }
    
    .zoomOverlay .button {
      cursor: pointer;
      user-select: none;
      font-size: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      height: 35px;
      width: 35px;
      color: ${currentMode ? '#c7c7c7' : '#000'};
      border-radius: 32px;
      transition: background 0.2s;
    }
    
    .zoomOverlay .blueButton {
      border: ${currentMode ? '#047cb6 2px solid' : '#a9c8fa 2px solid'};
      border-radius: 32px;
      width: 60px;
      color: ${currentMode ? '#a8c7fa' : '#0b57d0'};
      font-size: 13px;
    }
  `;
  
  document.head.appendChild(style);
}

// Create overlay from template
function createOverlayFromTemplate() {
  const template = `
    <div class="zoomOverlay">
      <div class="zoomCounter">${zoomLevels[currentZoomIndex]}%</div>
      <div class="rightWrap">
        <div class="zoomOutButton button signButton">-</div>
        <div class="zoomInButton button signButton">+</div>
        <div class="resetButton button blueButton">Reset</div>
      </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = template;
  return tempDiv.firstElementChild;
}

// Add event listeners to overlay elements
function addOverlayEventListeners(overlay) {
  const zoomOutButton = overlay.querySelector('.zoomOutButton');
  const zoomInButton = overlay.querySelector('.zoomInButton');
  const resetButton = overlay.querySelector('.resetButton');

  zoomOutButton.addEventListener('click', decreaseZoomLevel);
  zoomInButton.addEventListener('click', increaseZoomLevel);
  resetButton.addEventListener('click', resetZoomLevel);
}

// Function to create the zoom overlay element
function createOverlay() {
  // Check if overlay already exists
  if (document.querySelector('.zoomOverlay')) {
    return;
  }

  // Inject CSS if not already present
  injectOverlayStyles();

  // Create overlay using template
  const overlay = createOverlayFromTemplate();
  
  // Add event listeners
  addOverlayEventListeners(overlay);

  // Add to document
  document.body.appendChild(overlay);

  // Initial update
  updateOverlay();
}

// Load saved zoom index from Chrome storage so that zoom is persistent across sessions
getFromChromeStorage('websiteLevels', (value) => {
  // Zoom parameters
  currentZoomIndex = findValueOfTheCurrentWebsite(value, resetZoom);
  console.log(value, currentZoomIndex);

  // Set initial zoom and create overlay
  updateZoom();

  // Wait for DOM to be ready before creating overlay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createOverlay();
    });
  } else {
    createOverlay();
  }

  document.addEventListener(
    'wheel',
    (event) => {
      // Check if the Ctrl key is pressed (Cmd key on Mac)
      if (
        (event.ctrlKey && navigator.userAgent.indexOf('Mac OS X') === -1) ||
        event.metaKey
      ) {
        event.preventDefault();
        // Determine zoom direction based on scroll direction
        const zoomIndexIncrease = event.deltaY > 0 ? -1 : 1;
        currentZoomIndex += zoomIndexIncrease;

        // Clamp the zoom index to valid ranges
        if (currentZoomIndex < 0) currentZoomIndex = 0;
        if (currentZoomIndex >= zoomLevels.length) currentZoomIndex = zoomLevels.length - 1;

        // Apply the zoom level
        updateZoom();

        // Update overlay scale to counteract zoom and update counter
        updateOverlay();
      }

      // Use passive to prevent errors if installed on windows machines
    },
    { passive: false }
  );
});

// Save the current zoom index before the page dies or is refreshed
window.addEventListener('beforeunload', () => {
  getFromChromeStorage('websiteLevels', (storedValues) => {
    const updatedValues = { ...storedValues, [currentOrigin]: currentZoomIndex };
    saveToChromeStorage('websiteLevels', updatedValues);
  });
});

// Also save when the page visibility changes (e.g., switching tabs)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    getFromChromeStorage('websiteLevels', (storedValues) => {
      const updatedValues = { ...storedValues, [currentOrigin]: currentZoomIndex };
      saveToChromeStorage('websiteLevels', updatedValues);
    });
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