// Initialize side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'apiSettings',
    title: 'API Settings',
    contexts: ['action']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'apiSettings') {
    chrome.tabs.create({ url: chrome.runtime.getURL('api-key.html') });
  }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.apiKey) {
    console.log('API key updated');
  }
});
