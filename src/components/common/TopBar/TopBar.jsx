import './TopBar.scss';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function TopBar({title}) {
    const navigate = useNavigate();
    
    // Handle back navigation
    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <header className="top-bar">
            <div className="inner">
                <div className="back">
                    <button 
                        onClick={handleGoBack} 
                        className="back-button"
                        aria-label="Torna indietro"
                    >
                        <MdChevronLeft size={24} />
                        <span>Indietro</span>
                    </button>
                </div>
                
                <div className="title">
                    <h2>{title}</h2>
                </div>
            </div>
        </header>
    );
}