import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, subscribeToFavorites } from '../utils/favorites';
import './ListaTodos.css';
import img01 from '../assets/57 secondi.jpg';
import img02 from '../assets/argo.jpg';
import img03 from '../assets/dracula.jpg';
import img04 from '../assets/gladiatore.jpg';
import img05 from '../assets/inception.jpg';
import img06 from '../assets/king conqueror.jpg';
import img07 from '../assets/Oppenheimer.jpg';
import img08 from '../assets/prophecy.jpg';
import img09 from '../assets/Titanic.jpg';
import img10 from '../assets/un delitto ideale.jpg';

const filmImages = {
  1: img01,
  2: img02,
  3: img03,
  4: img04,
  5: img05,
  6: img06,
  7: img07,
  8: img08,
  9: img09,
  10: img10
};

export default function Preferiti() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    const unsubscribe = subscribeToFavorites(setFavorites);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="page-title">I Miei Preferiti</h1>

        {favorites.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>❤️</div>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Nessun preferito</h2>
            <p className="muted" style={{ fontSize: '16px' }}>
              Aggiungi film ai preferiti dalla pagina "Lista Film" cliccando sull'icona a cuore.
            </p>
          </div>
        ) : (
          <div className="todos-list">
            {favorites.map((film) => (
              <div key={film.id} className="todo-card">
                <div className="todo-card-content">
                  <div
                    className="todo-card-image-wrapper"
                    onClick={() => navigate(`/home/film/${film.id}`)}
                  >
                    <img
                      src={film.image || filmImages[film.id] || img01}
                      alt={film.title}
                      className="todo-card-image"
                    />
                  </div>
                  <div className="todo-card-info">
                    <h3 className="todo-card-title">{film.title}</h3>
                    <div className="todo-card-footer">
                      <div className="todo-card-status">
                        <span className="todo-status-badge completed">Preferito</span>
                      </div>
                      <div className="todo-card-actions">
                        <button
                          onClick={() => handleRemove(film.id)}
                          className="todo-button todo-button-delete"
                          style={{ flex: 'none', minWidth: '120px' }}
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

