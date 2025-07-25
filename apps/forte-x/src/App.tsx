import { ModalMarker } from "@repo/ui/components/dialog";
import { Toaster } from "@repo/ui/components/sonner";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./components/providers/theme-provider";
import { router } from "./router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <ModalMarker />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
