import React from 'react';
import ReactDOM from 'react-dom/client';
import { MaxUI } from '@maxhub/max-ui';
import '@maxhub/max-ui/dist/styles.css';
import { App } from './App';
import { notifyMaxAppReady } from './shared/maxBridge/maxBridge';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element was not found');
}

notifyMaxAppReady();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MaxUI resetBody colorScheme="light">
      <App />
    </MaxUI>
  </React.StrictMode>,
);
