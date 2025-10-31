
import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
import '../index.css';

const root = document.getElementById('admin-root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
} else {
  console.error('Admin root element not found');
}
