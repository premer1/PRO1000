
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import DashboardT from "./pages/DashboardT.tsx";
import CustomersT from "./pages/CustomersT.tsx";
import Activities from "./pages/Activities";
import Settings from "./pages/Settings";
import Tickets from "./pages/Tickets.tsx";
import {TicketOpen} from "./pages/TicketOpen.tsx";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardT />} />
            <Route path="customers" element={<CustomersT />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="activities" element={<Activities />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/tickets/:ticketNo" element={<TicketOpen />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;