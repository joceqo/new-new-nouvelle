import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, router, AuthProvider, WorkspaceProvider } from '@nouvelle/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
    </AuthProvider>
  </React.StrictMode>
);
