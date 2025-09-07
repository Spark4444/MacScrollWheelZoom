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
    return storedValues[currentOrigin] ?? defaultValue;
  }
  return defaultValue;
}

// Initialize current zoom index
let currentZoomIndex = zoomLevels.indexOf(100);
const resetZoom = currentZoomIndex;
const isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;
let overlayTimeout, disappearTimeout;

// Functions to set and reset button greyed out state
function setButtonGrey(index) {
  const buttons = document.querySelectorAll('.signButton');
  if (buttons[index]) {
    const currentButton = buttons[index];
    currentButton.classList.add('grey');
    currentButton.style.cursor = 'auto';
  }
}

function resetButton(index) {
  const buttons = document.querySelectorAll('.signButton');
  if (buttons[index]) {
    const currentButton = buttons[index];
    currentButton.classList.remove('grey');
    currentButton.style.cursor = 'pointer';
  }
}

function resetAllButtons() {
  const buttons = document.querySelectorAll('.signButton');
  buttons.forEach((button) => {
    button.classList.remove('grey');
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

// Function to update the zoom level of the page
function updateZoom() {
  document.body.style.zoom = `${zoomLevels[currentZoomIndex]}%`;
}

// Function to update all overlay elements
function updateOverlay() {
  updateOverlayScale();
  updateButtonStyles();
  updateZoomCounter();
}

// Function to hide overlay after a delay
function hideOverlay(delay = 2000) {
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    overlay.style.display = '';
    if (overlayTimeout) clearTimeout(overlayTimeout);
    if (disappearTimeout) clearTimeout(disappearTimeout);
    overlayTimeout = setTimeout(() => {
      overlay.classList.remove('disappear');
      overlay.style.display = 'none';
    }, delay);
    disappearTimeout = setTimeout(() => {
      overlay.classList.add('disappear');
    }, delay - 300);
  }
}

// Reset, increase, decrease zoom level functions for overlay buttons
function resetZoomLevel() {
  currentZoomIndex = resetZoom;
  updateZoom();
  updateOverlay();
  hideOverlay();
}
 
function increaseZoomLevel() {
  if (currentZoomIndex < zoomLevels.length - 1) {
    currentZoomIndex++;
    updateZoom();
    updateOverlay();
    hideOverlay();
  }
}

function decreaseZoomLevel() {
  if (currentZoomIndex > 0) {
    currentZoomIndex--;
    updateZoom();
    updateOverlay();
    hideOverlay();
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
      background: #1f1f1f;
      color: #c7c7c7;
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

    .rightWrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 128px;
    }

    .button {
      cursor: pointer;
      user-select: none;
      font-size: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .blueButton {
      border: #047cb6 2px solid;
      border-radius: 32px;
      display: flex;
      height: 35px;
      width: 60px;
      background: none;
      color: #a8c7fa;
      font-size: 13px;
      align-items: center;
      justify-content: center;
    }

    .grey {
      color: #5f5f5f;
    }

    .appear {
      animation: appear 0.3s linear;
    }

    .disappear {
      animation: disappear 0.3s linear;
    }

    @keyframes appear {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes disappear {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @media (prefers-color-scheme: light) {
        .zoomOverlay {
          background: white;
          color: black;
        }
        
        .blueButton {
          border: #a9c8fa 2px solid;
          color: #0b57d0;
          background: none;
        }
        
        .grey {
          color: #b9b9b9;
        }
    }
  `;
  
  document.head.appendChild(style);
}

// Create overlay from template
function createOverlayFromTemplate() {
  const template = `
    <div class="zoomOverlay appear" style="display: none;">
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
        (event.ctrlKey && !isMac) ||
        event.metaKey
      ) {
        event.preventDefault();
        // Determine zoom direction based on scroll direction
        const zoomIndexIncrease = event.deltaY > 0 ? -1 : 1;
        currentZoomIndex += zoomIndexIncrease;

        // Clamp the zoom index to valid ranges
        if (currentZoomIndex < 0) {
          currentZoomIndex = 0;
        }
        else if (currentZoomIndex >= zoomLevels.length) {
          currentZoomIndex = zoomLevels.length - 1;
        }
        else {
          // Hide overlay after zoom
          hideOverlay();
        }

        // Apply the zoom level
        updateZoom();

        // Update overlay scale to counteract zoom and update counter
        updateOverlay();
      }

      // Use passive to prevent errors if installed on windows machines
    },
    { passive: false }
  );

  // Check if the Ctrl key is pressed (Cmd key on Mac) along with +, -, or 0
  document.addEventListener('keydown', (event) => {
    if (
      (event.ctrlKey && !isMac) ||
      event.metaKey
    ) {
      switch (event.key) {
        case '=':
          event.preventDefault();
          increaseZoomLevel();
          break;
        case '-':
          event.preventDefault();
          decreaseZoomLevel();
          break;
      }
    }
  }, { passive: false });
});

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