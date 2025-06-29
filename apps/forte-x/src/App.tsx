import { ThemeProvider } from "./components/providers/theme-provider";
import LoginPage from "./pages/public/LoginPage";
import ProjectsPage from "./pages/public/ProjectsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <LoginPage /> */}
      <ProjectsPage />
    </ThemeProvider>
  );
}

export default App;
