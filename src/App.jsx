
import './styles/main.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import RouteGuard from './components/utils/RouteGuard/RouteGuard';
import MainLayout from './layouts/MainLayout/MainLayout';

import LoginPage from './routes/LoginPage/LoginPage';
import ManageUsers from './routes/ManageUsers/ManageUsers';
import UserPage from './routes/UserPage/UserPage';
import ManageBookings from './routes/ManageBookings/ManageBookings';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<RouteGuard><MainLayout /></RouteGuard>}>
            <Route index element={<Navigate to="/gestione-utenti" replace />} />
            <Route path="gestione-utenti" element={<ManageUsers />} />
            <Route path="gestione-utenti/:name" element={<UserPage />} />
            <Route path="gestione-sala" element={<ManageBookings />} />
          </Route>
          
          {/* Gestione 404 - reindirizza alla home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

