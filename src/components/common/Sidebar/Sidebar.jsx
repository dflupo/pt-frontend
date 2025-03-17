import './Sidebar.scss'
import { Link } from "react-router-dom";
import { MdHome, MdPeople, MdEventSeat } from "react-icons/md";
import Logo from '../../../assets/Logo.svg'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      
      <nav>
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
    </div>
  );
};