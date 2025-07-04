import { ModalMarker } from "@repo/ui/components/dialog";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./components/providers/theme-provider";
import Pages from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Pages />
        <ModalMarker />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
