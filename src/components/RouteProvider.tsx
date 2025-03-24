import { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import { cookie } from "lib/hooks";
import { IsAuthorized } from "lib/role-permissions";
import { ROUTES } from "lib/routes";

import ErrorPage from "pages/404";

import { useInactivityTimeout } from "../lib/useInactivityTimeout";
import AlertProvider from "./AlertProvider";
import Layout from "./Dashboard/Layout";
import { SearchConsole } from "./Layout/Header/SearchConsole";
import { ProfileProvider } from "./ProfileContext";
import Providers from "./Providers";
import CustomPrompt from "./ui/alert/custom-prompt";
import ModalMarker from "./ui/dialogue/v2/Modal";
import Spinner from "./ui/spinner/spinner";

const Admin = () => {
  const PRIV = ROUTES.filter((item) => !item?.public);
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        <Route index element={<Navigate to="/beneficiaries" />} />
        {PRIV.map(({ link, Component, permissions }) => (
          <Route
            key={link}
            path={link}
            element={
              <>
                <SearchConsole />
                {IsAuthorized(permissions) && <Component />}
              </>
            }
          />
        ))}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

const PrivateMapper = () => {
  const token = cookie.get("access_token");
  if (!token)
    return <Navigate to="/" state={{ from: window.location.pathname }} />;
  return (
    <ProfileProvider>
      <CustomPrompt />
      <ModalMarker />
      <Admin />
    </ProfileProvider>
  );
};

const RouteProvider = () => {
  useInactivityTimeout();

  const PUB = ROUTES.filter((item) => item.public);

  return (
    <Router>
      <Providers>
        <AlertProvider>
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Routes>
              {PUB.map(({ link, Component }) => (
                <Route key={link} path={link} element={<Component />} />
              ))}
              <Route path="*" element={<PrivateMapper />} />
            </Routes>
          </Suspense>
        </AlertProvider>
      </Providers>
    </Router>
  );
};

export default RouteProvider;
