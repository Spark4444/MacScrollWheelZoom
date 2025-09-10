// Origin of the current website
const currentOrigin = window.location.origin;
// Check if the user is on a Mac
const isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;

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