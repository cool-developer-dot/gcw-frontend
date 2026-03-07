import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import StakingPage from './pages/StakingPage';
import ReferralPage from './pages/ReferralPage';
import FinancePage from './pages/FinancePage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staking"   element={<StakingPage />} />
        <Route path="/referral"  element={<ReferralPage />} />
        <Route path="/finance"   element={<FinancePage />} />
        <Route path="/admin"     element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;