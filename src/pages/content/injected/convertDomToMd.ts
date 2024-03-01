import TurndownService from 'turndown';

const turndownService = new TurndownService();

function captureAndConvertDOM() {
  const htmlContent = document.body.innerHTML; // Capture the entire body's HTML
  const markdown = turndownService.turndown(htmlContent); // Convert HTML to Markdown

  console.log(markdown);

  // Send the Markdown content to the background script
  chrome.runtime.sendMessage({ action: 'SEND_MARKDOWN', markdown: markdown });
}

// You can trigger this function based on specific events, like opening the side panel
captureAndConvertDOM();
