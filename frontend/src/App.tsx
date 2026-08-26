import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Rewards from "./pages/Rewards";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-4 pb-20 sm:p-6 sm:pb-20 lg:p-8 lg:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;