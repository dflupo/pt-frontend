import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../api/auth';
import './LoginForm.scss';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validazione base
    if (!email || !password) {
      setError('Per favore inserisci email e password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const response = await authAPI.login(email, password);
      
      // Se il login ha successo, reindirizza alla dashboard
      if (response && response.access_token) {
        // Garantisci che il token sia correttamente impostato per RouteGuard
        localStorage.setItem('authToken', response.access_token);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError(
        err.response?.data?.message || 
        'Impossibile effettuare il login. Verifica le tue credenziali.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Accedi</h2>
        
        {error && <div className="error-message">{error}</div>}
        
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