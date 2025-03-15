import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/features/LoginForm/LoginForm';
import './LoginPage.scss';

export default function LoginPage() {
  const navigate = useNavigate();
  
  // Verifica se l'utente è già loggato
  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const token = localStorage.getItem('authToken');
    
    // if (token) {
    //   // Se l'utente è già loggato, reindirizza alla dashboard
    //   navigate('/dashboard');
    // }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-logo">
      </div>
      <LoginForm />
    </div>
  );
}