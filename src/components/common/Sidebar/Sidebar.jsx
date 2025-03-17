import './Sidebar.scss'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdHome, MdPeople, MdFitnessCenter, MdLogout } from "react-icons/md";
import Logo from '../../../assets/Logo.svg'
import useAuth from '../../../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook per ottenere la location corrente

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Funzione per verificare se il link è attivo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      
      <nav className="main-nav">
        <Link to="/" className={isActive('/')}>
          <MdHome className="nav-icon" />
          <span>Home</span>
        </Link>
        <Link to="/gestione-utenti" className={isActive('/gestione-utenti')}>
          <MdPeople className="nav-icon" />
          <span>Clienti</span>
        </Link>
        <Link to="/gestione-sala" className={isActive('/gestione-sala')}>
          <MdFitnessCenter className="nav-icon" />
          <span>Sala e Turni</span>
        </Link>
      </nav>

      <div className="nav-bottom">
        <button onClick={handleLogout} className="logout-button">
          <MdLogout className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};