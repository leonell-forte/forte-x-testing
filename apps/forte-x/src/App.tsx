import { ModalMarker } from "@repo/ui/components/dialog";
import { Toaster } from "@repo/ui/components/sonner";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./components/providers/theme-provider";
import Pages from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Pages />
        <ModalMarker />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
