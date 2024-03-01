import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import LexicalEditor from '@pages/sidepanel/LexicalEditor';

const SidePanel = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div className="App">
      <h2>BrowserAI</h2>
      <LexicalEditor />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
