import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, router } from '@nouvelle/router';

// Import your global styles here
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
