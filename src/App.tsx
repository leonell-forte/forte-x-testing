import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import UsersPage from "./pages/Users/UsersPage";
import DashboardLayout from "./components/Dashboard/Layout";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ComponentsPage from "./pages/Components/ComponentsPage";
import ErrorPage from "./pages/404";
import Providers from "./components/Providers";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import QueryProvider from "./components/QueryProvider";
import AlertProvider from "./components/AlertProvider";

function App() {
  return (
    <QueryProvider>
      <div>
        <div className="bg-body-gradient w-screen h-screen fixed top-0 left-0 z-[-1]"></div>
        <Router>
          <Providers>
            <AlertProvider>
              <Routes>
                <Route element={<ErrorPage />} path="*" />
                <Route element={<ComponentsPage />} path="/components" />
                <Route element={<LoginPage />} path="/" />
                <Route element={<SignupPage />} path="/signup" />
                <Route
                  element={<ForgotPasswordPage />}
                  path="/forgot-password"
                />
                <Route
                  path="/users"
                  element={
                    <DashboardLayout>
                      <UsersPage />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <DashboardLayout>
                      <ProjectsPage />
                    </DashboardLayout>
                  }
                />
              </Routes>
            </AlertProvider>
          </Providers>
        </Router>
      </div>
    </QueryProvider>
  );
}

export default App;
