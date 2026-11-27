import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (rootEl.innerHTML.trim().length > 0 && !rootEl.innerHTML.includes('<!--app-html-->')) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
