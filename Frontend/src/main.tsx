import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importiere Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
// Importiere Bootstrap JavaScript (und Popper.js als Abhängigkeit)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Du kannst die ursprüngliche index.css beibehalten oder löschen/anpassen,
// wenn du nur Bootstrap-Styles verwenden möchtest.
// import './index.css'; 

// Den Root-Container für die React-App finden
const rootElement = document.getElementById('root');

// Sicherstellen, dass das Root-Element existiert
if (rootElement) {
  // Eine neue React-Root erstellen und die App rendern
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error('Root element with ID "root" not found in the DOM.');
}