import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  router,
  AuthProvider,
  WorkspaceProvider,
  PageProvider,
} from "@nouvelle/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <WorkspaceProvider>
        <PageProvider>
          <RouterProvider router={router} />
        </PageProvider>
      </WorkspaceProvider>
    </AuthProvider>
  </React.StrictMode>
);
