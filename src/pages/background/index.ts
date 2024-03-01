import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

let markdownContent = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_SIDE_PANEL') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        let currentTab = tabs[0]; // Get the current tab
        chrome.sidePanel.open({ windowId: currentTab.windowId });
      }
    });
  } else if (request.action === 'SEND_MARKDOWN') {
    console.log('Markdown:', request.markdown);
    markdownContent = request.markdown; // Store the received Markdown content
  } else if (request.action === 'REQUEST_MARKDOWN') {
    sendResponse({ markdown: markdownContent }); // Send the stored Markdown content
  }
});
