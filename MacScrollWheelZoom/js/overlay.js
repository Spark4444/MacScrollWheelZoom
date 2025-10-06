// Define available zoom levels
const zoomLevels = [
  25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500,
];

// Initialize current zoom index
let currentZoomIndex = zoomLevels.indexOf(100);
const resetZoom = currentZoomIndex;

let overlayTimeout, disappearTimeout;

// This variable prevents it hiding when user toggled it through the extension icon
let canHideOverlay = true;

// Functions to set and reset button greyed out state
function setButtonGrey(index) {
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    const buttons = overlay.querySelectorAll('.zoomSignButton');
    if (buttons[index]) {
      const currentButton = buttons[index];
      currentButton.classList.add('zoomGrey');
      currentButton.classList.remove('zoomButtonHover');
      currentButton.style.cursor = '';
    }
  }
}

function resetButton(index) {
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    const buttons = overlay.querySelectorAll('.zoomSignButton');
    if (buttons[index]) {
      const currentButton = buttons[index];
      currentButton.classList.remove('zoomGrey');
      currentButton.classList.add('zoomButtonHover');
      currentButton.style.cursor = 'pointer';
    }
  }
}

function resetAllButtons() {
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    const buttons = overlay.querySelectorAll('.zoomSignButton');
    buttons.forEach((button) => {
      button.classList.remove('zoomGrey');
      button.classList.add('zoomButtonHover');
      button.style.cursor = 'pointer';
    });
  }
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

function clearTimeouts() {
  if (overlayTimeout) clearTimeout(overlayTimeout);
  if (disappearTimeout) clearTimeout(disappearTimeout);
}

// Function to hide overlay after a delay
function hideOverlay(delay = 2000) {
    if (canHideOverlay) {
        const overlay = document.querySelector('.zoomOverlay');
        if (overlay) {
            overlay.style.display = '';
            clearTimeouts();
            overlayTimeout = setTimeout(() => {
            overlay.classList.remove('zoomDisappear');
            overlay.style.display = 'none';
            }, delay);
            disappearTimeout = setTimeout(() => {
            overlay.classList.add('zoomDisappear');
            }, delay - 300);
        }
    }
}

// Function to hide overlay immediately without animation
function hideOverlayImmediate() {
    const overlay = document.querySelector('.zoomOverlay');
    if (overlay) {
        clearTimeouts();
        canHideOverlay = true;
        overlay.classList.remove('zoomDisappear');
        overlay.style.display = 'none';
    }
}

// Function to show or hide the overlay manually
function showHideOverlay() {
  const overlay = document.querySelector('.zoomOverlay');
  if (overlay) {
    clearTimeouts();
    if (overlay.style.display === '') {
        overlay.classList.add('zoomDisappear');
        disappearTimeout = setTimeout(() => {
            canHideOverlay = true;
          overlay.style.display = 'none';
          overlay.classList.remove('zoomDisappear');
        }, 300);
    }
    else if (overlay.style.display === 'none') {
        canHideOverlay = false;
        overlay.classList.remove('zoomDisappear');
        overlay.style.display = '';
    }
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
  if (document.querySelector('#zoomOverlayStyles')) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.id = 'zoomOverlayStyles';
  style.textContent = cssStyles;
  
  document.head.appendChild(style);
}

// Create overlay from template
function createOverlayFromTemplate() {
  const template = `
    <div class="zoomOverlay zoomAppear" style="display: none;">
        <div class="zoomCounter">100%</div>
        <div class="zoomRightWrap">
            <div class="zoomSignButton zoomButton zoomButtonHover" title="Make Text Smaller">-</div>
            <div class="zoomSignButton zoomButton zoomButtonHover" title="Make Text Larger">+</div>
            <div class="zoomResetButton zoomButton" title="Reset to default zoom level">Reset</div>
        </div>
    </div>
  `;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = template;
  return tempDiv.firstElementChild;
}

// Add event listeners to overlay elements
function addOverlayEventListeners(overlay) {
  const signButtons = overlay.querySelectorAll('.zoomSignButton');
  const zoomOutButton = signButtons[0];
  const zoomInButton = signButtons[1];
  const resetButton = overlay.querySelector('.zoomResetButton');

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