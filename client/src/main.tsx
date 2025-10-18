import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

function renderApp() {
  try {
    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }
    
    const reactRoot = createRoot(root);
    reactRoot.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
    showErrorPage(error);
  }
}

function showErrorPage(error: any) {
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; background: #f5f5f5;">
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; text-align: center;">
        <h1 style="color: #dc3545; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #6c757d; margin-bottom: 1.5rem;">Failed to load the application. Please try refreshing the page.</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick="window.location.reload()" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 5px; cursor: pointer;">
            Refresh Page
          </button>
          <button onclick="window.location.href='/'" style="padding: 10px 20px; border: 1px solid #ccc; background: white; color: #333; border-radius: 5px; cursor: pointer;">
            Go Home
          </button>
        </div>
        ${error && typeof error === 'object' && error.message ? 
          `<details style="margin-top: 1rem; text-align: left;">
            <summary style="cursor: pointer; color: #6c757d;">Error Details</summary>
            <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow: auto; font-size: 12px; margin-top: 0.5rem;">${error.message}${error.stack ? '\n\n' + error.stack : ''}</pre>
          </details>` : ''
        }
      </div>
    </div>
  `;
}

// Add a small delay to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}