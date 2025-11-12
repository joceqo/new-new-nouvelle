import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  router,
  AuthProvider,
  WorkspaceProvider,
  PageProvider,
  ThemeProvider,
  queryClient,
  useAuth,
  useWorkspace,
} from "@nouvelle/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Inner app component that provides router context
function App() {
  const auth = useAuth();
  const workspace = useWorkspace();

  return (
    <>
      <RouterProvider
        router={router}
        context={{
          auth: {
            isAuthenticated: auth.isAuthenticated,
            isLoading: auth.isLoading,
            user: auth.user,
          },
          workspace: {
            workspaces: workspace.workspaces,
            activeWorkspace: workspace.activeWorkspace,
            isLoading: workspace.isLoading,
          },
        }}
      />
      <TanStackRouterDevtools
        router={router}
        initialIsOpen={false}
        position="bottom-right"
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WorkspaceProvider>
            <PageProvider>
              <App />
            </PageProvider>
          </WorkspaceProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
