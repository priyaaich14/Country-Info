import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Tailwind CSS and any global styles
import './styles/global.css';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
 
    <BrowserRouter>
      <App />
    </BrowserRouter>
 
);
