import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from './App';

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render application:', error);
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 5px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}