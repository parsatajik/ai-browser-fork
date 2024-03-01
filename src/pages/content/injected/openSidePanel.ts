import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/openSidePanel');

async function openSidePanel() {
  console.log('open side panel');

  document.addEventListener('keydown', event => {
    if (event.key === ';' && event.metaKey) {
      // Cmd+L for MacOS
      event.preventDefault(); // Prevent the default action
      chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL' });
      console.log('open side panel');
    }
  });
}

void openSidePanel();
