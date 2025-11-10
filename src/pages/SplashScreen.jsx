import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import Logo from '../components/Logo';
import './SplashScreen.css';

export default function SplashScreen() {
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    // Dopo che l'animazione del logo è completa, inizia la dissolvenza
    setTimeout(() => {
      setIsFading(true);
      
      // Dopo la dissolvenza, naviga alla pagina Home
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800); // Durata della dissolvenza (0.8s)
    }, 300); // Piccolo delay prima della dissolvenza
  };

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <Logo size="xlarge" animate={true} onAnimationComplete={handleAnimationComplete} />
      </div>
    </div>
  );
}

