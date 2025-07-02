import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./components/providers/theme-provider";
import Pages from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Pages />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
