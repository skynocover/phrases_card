import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './AppContext';
import './index.css';

import { BackendlessProvider } from './hooks/useBackendless';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BackendlessProvider subDomain={import.meta.env.VITE_BACKENDLESS_SUBDOMAIN}>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </BackendlessProvider>
  </React.StrictMode>,
);
