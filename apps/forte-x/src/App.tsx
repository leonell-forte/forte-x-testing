import { ThemeProvider } from "./components/providers/theme-provider";
import LoginPage from "./features/auth/LoginPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;
