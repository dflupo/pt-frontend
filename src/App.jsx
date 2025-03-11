import './styles/main.scss'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RouteGuard from './components/utils/RouteGuard/RouteGuard';
import MainLayout from './layouts/MainLayout/MainLayout'; // Corretto con lettera maiuscola

import LoginPage from './routes/LoginPage/LoginPage';
import Test from './routes/Test/Test';
import UserPage from './routes/UserPage/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<RouteGuard><MainLayout /></RouteGuard>}>

          <Route path="dashboard" element={<Test />} />
          <Route path="users/:name" element={<UserPage />} />


          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        <Route path="*" element={
          localStorage.getItem('authToken') 
            ? <Navigate to="/dashboard" replace /> 
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;