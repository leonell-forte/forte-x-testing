import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import StoreProvider from "./components/StoreProvider";
import MuiProvider from "./components/MuiProvider";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import UsersPage from "./pages/Users/UsersPage";
import DashboardLayout from "./components/Dashboard/Layout";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";

function App() {
  return (
    <div className="bg-body-gradient w-screen h-screen fixed top-0 left-0 z-[-1]">
      <StoreProvider>
        <MuiProvider>
          <Router>
            <Routes>
              <Route element={<LoginPage />} path="/" />
              <Route element={<SignupPage />} path="/signup" />
              <Route element={<ForgotPasswordPage />} path="/forgot-password" />

              <Route
                path="/users"
                element={
                  <DashboardLayout>
                    <UsersPage />
                  </DashboardLayout>
                }
              />
            </Routes>
          </Router>
        </MuiProvider>
      </StoreProvider>
    </div>
  );
}

export default App;
