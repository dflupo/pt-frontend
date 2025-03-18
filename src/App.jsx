import './styles/main.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import RouteGuard from './components/utils/RouteGuard';
import MainLayout from './layouts/MainLayout/MainLayout';
import ErrorBoundary from './components/utils/ErrorBoundary';

import LoginPage from './routes/LoginPage/LoginPage';
import ManageUsers from './routes/ManageUsers/ManageUsers';
import UserPage from './routes/UserPage/UserPage';
import ManageBookings from './routes/ManageBookings/ManageBookings';
import SubscriptionsPage from './routes/SubscriptionsPage/SubscriptionsPage';

export default function App() {
  return (
    <ErrorBoundary showDetails={true}>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>

            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<RouteGuard><MainLayout /></RouteGuard>}>

              <Route index element={<Navigate to="/gestione-utenti" replace />} />
              <Route path="gestione-utenti" element={<ManageUsers />} />
              <Route path="gestione-utenti/:name" element={<UserPage />} />

              <Route path="gestione-sala" element={<ManageBookings />} />

              <Route path="abbonamenti" element={<SubscriptionsPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}