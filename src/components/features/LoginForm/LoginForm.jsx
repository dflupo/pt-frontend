import './LoginForm.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  
  // Use the auth hook for login functionality
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setFormError('Per favore inserisci email e password');
      return;
    }

    try {
      setFormError('');
      
      // Use the login function from the hook
      const user = await login(email, password);
      
      // If login is successful, redirect to dashboard
      if (user) {
        navigate('/gestione-utenti', { replace: true });
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setFormError(
        err.response?.data?.detail || 
        'Impossibile effettuare il login. Verifica le tue credenziali.'
      );
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Accedi</h2>
        
        {/* Show error from form validation or from the hook */}
        {(formError || error) && (
          <div className="error-message">{formError || error}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="La tua password"
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </div>
        
        <div className="form-footer">
          <a href="/forgot-password">Password dimenticata?</a>
        </div>
      </form>
    </div>
  );
}