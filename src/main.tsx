import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { store } from './ui/store';
import './ui/style.css';
import { SHOW_LOC_TOOLS } from './config';
import { startLocHighlight } from './ui/locHighlight';
import { installClickToEdit } from './dev/devMode';

store.start();
if (SHOW_LOC_TOOLS) startLocHighlight();
installClickToEdit();
// Save before the dev server reloads the page (for example after editing strings.csv in Excel).
import.meta.hot?.on('vite:beforeFullReload', () => store.save());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
