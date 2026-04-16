import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Customers from "./pages/Customers";
import Tickets from "./pages/Tickets";
import TicketDetails from "./pages/TicketDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="tickets/:id" element={<TicketDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
