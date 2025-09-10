// Background script for handling extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
    // Send message to content script to toggle overlay
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay' });
});