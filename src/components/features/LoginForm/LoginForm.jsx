import './LoginForm.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import LogoDark from '../../../assets/LogoDark.svg'

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
  const navigate = useNavigate();
  
  // Use the auth hook for login functionality
  const { login, loading, error } = useAuth();

  // Reset auth error when component mounts
  useEffect(() => {
    // Non facciamo nulla qui, lasciamo che l'errore venga gestito solo dopo un tentativo di login
    return () => {
      // Cleanup quando il componente viene smontato
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setFormError('Per favore inserisci email e password');
      return;
    }

    try {
      setFormError('');
      setIsSubmitting(true);
      setHasAttemptedLogin(true); // Imposta il flag che indica che è stato fatto un tentativo di login
      
      // Use the login function from the hook
      const user = await login(email, password);
      
      // If login is successful, redirect to dashboard
      if (user) {
        navigate('/gestione-utenti', { replace: true });
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      
      // Gestione migliorata degli errori
      if (err.response) {
        // Errore specifico dal server
        if (err.response.status === 401) {
          setFormError('Credenziali non valide. Verifica email e password.');
        } else if (err.response.status === 422) {
          // Errori di validazione
          const errorDetail = err.response.data?.detail;
          if (Array.isArray(errorDetail) && errorDetail.length > 0) {
            setFormError(errorDetail[0].msg || 'Errore di validazione');
          } else if (typeof errorDetail === 'string') {
            setFormError(errorDetail);
          } else {
            setFormError('Errore di validazione dei dati');
          }
        } else {
          setFormError(
            err.response.data?.detail || 
            'Si è verificato un errore durante il login. Riprova più tardi.'
          );
        }
      } else if (err.request) {
        // Nessuna risposta dal server
        setFormError('Impossibile contattare il server. Verifica la tua connessione.');
      } else {
        // Errore generico
        setFormError('Si è verificato un errore durante il login. Riprova più tardi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determina se mostrare l'errore: mostra solo errori del form o errori di autenticazione dopo un tentativo di login
  const shouldShowError = formError || (hasAttemptedLogin && error);
  const errorMessage = formError || (hasAttemptedLogin ? error : '');

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo">
          <img src={LogoDark} alt="Logo" />
        </div>
        
        {/* Show error only if there's a form error or if login was attempted */}
        {shouldShowError && (
          <div className="error-message">{errorMessage}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="La tua email"
            disabled={loading || isSubmitting}
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
            disabled={loading || isSubmitting}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="login-button"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </div>
        
        <div className="form-footer">
          <a href="/forgot-password">Password dimenticata?</a>
        </div>
      </form>
    </div>
  );
}