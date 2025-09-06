const zoomLevels = [
  25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
];

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

// Checks if a chrome storage value is set
function checkIfValueIsValidZoomIndex(value, defaultValue) {
  if (
    value === undefined ||
    value === null ||
    isNaN(value) ||
    value < 0 ||
    value >= zoomLevels.length
  ) {
    return defaultValue;
  } else {
    return value;
  }
}

// Detect color scheme
const currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const greyColor = currentMode === 'dark' ? '#5f5f5f' : '#b9b9b9';
// Initialize current zoom index
let currentZoomIndex = zoomLevels.indexOf(100);

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
  const resetZoom = 100;
  currentZoomIndex = zoomLevels.indexOf(resetZoom);
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

// Function to create the zoom overlay element
function createOverlay() {
  // Check if overlay already exists
  if (document.querySelector('.zoomOverlay')) {
    return;
  }

  // Styles from style.css
  const overlayBaseStyles = {
    position: 'fixed',
    top: '0',
    right: '32%',
    background: currentMode === 'dark' ? '#1f1f1f' : '#fff',
    color: currentMode === 'dark' ? '#c7c7c7' : '#000',
    padding: '0 17px',
    borderRadius: '16px',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    width: '220px',
    height: '50px',
    fontFamily: 'helvetica',
    justifyContent: 'space-between',
    fontSize: '13px',
    transformOrigin: 'top right',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  };
  const rightWrapStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '128px'
  };
  const buttonStyles = {
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    outline: 'none',
    padding: '0',
    margin: '0',
    height: '35px',
    width: '35px',
    color: currentMode === 'dark' ? '#c7c7c7' : '#000',
    borderRadius: '32px',
    transition: 'background 0.2s',
  };
  const blueButtonStyles = {
    border: currentMode === 'dark' ? '#047cb6 2px solid' : '#a9c8fa 2px solid',
    borderRadius: '32px',
    display: 'flex',
    height: '35px',
    width: '60px',
    background: 'none',
    color: currentMode === 'dark' ? '#a8c7fa' : '#0b57d0',
    fontSize: '13px',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Create main overlay container
  const overlay = document.createElement('div');
  overlay.className = 'zoomOverlay';
  Object.assign(overlay.style, overlayBaseStyles);

  // Create zoom counter
  const zoomCounter = document.createElement('div');
  zoomCounter.className = 'zoomCounter';
  zoomCounter.textContent = `${zoomLevels[currentZoomIndex]}%`;

  // Create right wrapper
  const rightWrap = document.createElement('div');
  rightWrap.className = 'rightWrap';
  Object.assign(rightWrap.style, rightWrapStyles);

  // Create zoom out button
  const zoomOutButton = document.createElement('div');
  zoomOutButton.className = 'zoomOutButton button signButton';
  zoomOutButton.textContent = '-';
  Object.assign(zoomOutButton.style, buttonStyles);

  // Create zoom in button
  const zoomInButton = document.createElement('div');
  zoomInButton.className = 'zoomInButton button signButton';
  zoomInButton.textContent = '+';
  Object.assign(zoomInButton.style, buttonStyles);

  // Create reset button
  const resetButton = document.createElement('div');
  resetButton.className = 'resetButton button blueButton';
  resetButton.textContent = 'Reset';
  Object.assign(resetButton.style, buttonStyles);
  Object.assign(resetButton.style, blueButtonStyles);

  // Add event listeners
  zoomOutButton.addEventListener('click', decreaseZoomLevel);
  zoomInButton.addEventListener('click', increaseZoomLevel);
  resetButton.addEventListener('click', resetZoomLevel);

  // Assemble the overlay
  rightWrap.appendChild(zoomOutButton);
  rightWrap.appendChild(zoomInButton);
  rightWrap.appendChild(resetButton);

  overlay.appendChild(zoomCounter);
  overlay.appendChild(rightWrap);

  // Add to document
  document.body.appendChild(overlay);

  // Initial update
  updateOverlay();
}

// Load saved zoom index from Chrome storage so that zoom is persistent across sessions
getFromChromeStorage('currentZoomIndex', (value) => {
  // Zoom parameters
  const resetZoom = 100;
  const zoomFactor = 25;
  currentZoomIndex = checkIfValueIsValidZoomIndex(value, resetZoom);

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
  saveToChromeStorage('currentZoomIndex', currentZoomIndex);
});

// Also save when the page visibility changes (e.g., switching tabs)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    saveToChromeStorage('currentZoomIndex', currentZoomIndex);
  } 
});

// Listen for changes in Chrome storage to sync zoom level across tabs
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.currentZoomIndex) {
    const newValue = changes.currentZoomIndex.newValue;
    if (newValue !== currentZoomIndex) {
      currentZoomIndex = checkIfValueIsValidZoomIndex(newValue, 100);
      updateZoom();
      updateOverlay();
    }
  }
});