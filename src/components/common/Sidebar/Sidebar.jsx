import './Sidebar.scss'
import { Link, useNavigate } from "react-router-dom";
import { MdHome, MdPeople, MdEventSeat, MdLogout } from "react-icons/md";
import Logo from '../../../assets/Logo.svg'
import useAuth from '../../../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      
      <nav className="main-nav">
        <Link to="/">
          <MdHome className="nav-icon" />
          <span>Home</span>
        </Link>
        <Link to="/gestione-utenti">
          <MdPeople className="nav-icon" />
          <span>Clienti</span>
        </Link>
        <Link to="/gestione-sala">
          <MdEventSeat className="nav-icon" />
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