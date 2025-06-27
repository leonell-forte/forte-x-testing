import { ThemeProvider } from "./components/providers/theme-provider";
// import LoginPage from "./pages/public/LoginPage";
import Playground from "./features/projects/Playground";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Playground />
    </ThemeProvider>
  );
}

export default App;
