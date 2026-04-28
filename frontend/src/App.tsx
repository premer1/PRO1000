import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Customers from "./pages/Customers";
import Tickets from "./pages/Tickets";
import TicketDetails from "./pages/TicketDetails";
import LoginPage from "./pages/LoginPage";

const ACCESS_STORAGE_KEY = "crm-access-granted";
const ACCESS_CODE = "1995";

function readStoredAccess() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(ACCESS_STORAGE_KEY) === "true";
}

function writeStoredAccess(granted: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (granted) {
    window.localStorage.setItem(ACCESS_STORAGE_KEY, "true");
    return;
  }

  window.localStorage.removeItem(ACCESS_STORAGE_KEY);
}

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  return <Outlet />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAccess);

  function handleUnlock(code: string) {
    const granted = code.trim() === ACCESS_CODE;

    if (granted) {
      writeStoredAccess(true);
      setIsAuthenticated(true);
    }

    return granted;
  }

  function handleLogout() {
    writeStoredAccess(false);
    setIsAuthenticated(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onUnlock={handleUnlock} />}
        />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<MainLayout onLogout={handleLogout} />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="tickets/:id" element={<TicketDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
