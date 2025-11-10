import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTodos } from '../api/jsonplaceholder';
import Navbar from '../components/Navbar';
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
import './FilmDetail.css';

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
  10: img10,
};

export default function FilmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todosForMapping, setTodosForMapping] = useState([]);
  
  const todoId = parseInt(id, 10);

  // Stato per le stelline
  const [rating, setRating] = useState(() => {
    try {
      const stored = localStorage.getItem('filmRatings');
      return stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.error('Impossibile leggere le valutazioni salvate', err);
      return {};
    }
  });


  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('filmReviews');
      const parsed = stored ? JSON.parse(stored) : {};
      
      // Controllo di sicurezza: assicurati che ogni entry sia un array
      // Questo aiuta a migrare da vecchi dati (dove era una stringa)
      Object.keys(parsed).forEach(key => {
        if (!Array.isArray(parsed[key])) {
          // Se non è un array (es. è una stringa vecchia), lo trasforma
          // Se era una stringa vuota o non valida, diventa array vuoto
          // Se era una stringa, la mettiamo in un array (o meglio, resettiamo)
          console.warn(`Dati non validi per ${key}, resetto.`);
          parsed[key] = []; 
        }
      });
      return parsed;

    } catch (err) {
      console.error('Impossibile leggere le recensioni salvate', err);
      return {};
    }
  });

  const [currentReviewText, setCurrentReviewText] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (editingReview) {
      setCurrentReviewText(editingReview.text);
    } else {
      setCurrentReviewText(''); 
    }
  }, [editingReview]);

  useEffect(() => {
    if (todoId) {
      loadTodo();
    }
  }, [todoId]);

  const currentRating = rating[todoId] || 0;

  function handleRate(stars) {
    const next = { ...rating, [todoId]: stars };
    setRating(next);
    try {
      localStorage.setItem('filmRatings', JSON.stringify(next));
    } catch (err) {
      console.error('Impossibile salvare la valutazione', err);
    }
  }

  function saveReviewsToStorage(allReviews) {
    try {
      localStorage.setItem('filmReviews', JSON.stringify(allReviews));
    } catch (err) {
      console.error('Impossibile salvare le recensioni', err);
    }
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    const reviewText = currentReviewText.trim();
    if (!reviewText) {
      alert("La recensione non può essere vuota!");
      return;
    }

    // Assicurati che 'currentFilmReviews' sia SEMPRE un array
    const currentFilmReviews = Array.isArray(reviews[todoId]) ? reviews[todoId] : [];
    let updatedFilmReviews;

    if (editingReview) {
      // Modalità MODIFICA
      updatedFilmReviews = currentFilmReviews.map(review => 
        review.id === editingReview.id ? { ...review, text: reviewText } : review
      );
    } else {
      // Modalità AGGIUNGI NUOVO
      const newReview = {
        id: Date.now().toString(),
        text: reviewText,
      };
      updatedFilmReviews = [...currentFilmReviews, newReview];
    }

    const allUpdatedReviews = { ...reviews, [todoId]: updatedFilmReviews };
    setReviews(allUpdatedReviews);
    saveReviewsToStorage(allUpdatedReviews);
    
    setEditingReview(null);
    setCurrentReviewText('');
  }

  function handleEditReview(reviewToEdit) {
    setEditingReview(reviewToEdit);
  }

  function handleDeleteReview(reviewId) {
    if (!window.confirm("Sei sicuro di voler eliminare questo commento?")) {
      return;
    }

    const currentFilmReviews = Array.isArray(reviews[todoId]) ? reviews[todoId] : [];
    const updatedFilmReviews = currentFilmReviews.filter(review => review.id !== reviewId);
    
    const allUpdatedReviews = { ...reviews, [todoId]: updatedFilmReviews };
    setReviews(allUpdatedReviews);
    saveReviewsToStorage(allUpdatedReviews);
  }

  function handleCancelEdit() {
    setEditingReview(null);
    setCurrentReviewText('');
  }


  async function loadTodo() {
    try {
      setLoading(true);
      setError(null);
      const todos = await getTodos(10);
      const foundTodo = todos.find(t => t.id === todoId);
      
      if (foundTodo) {
        setTodo(foundTodo);
        setTodosForMapping(todos);
      } else {
        setError('Film non trovato');
      }
    } catch (err) {
      setError(err.message || 'Errore nel caricamento del film');
    } finally {
      setLoading(false);
    }
  }

  // ... (gestione stati loading, error, !todo) ...
  if (loading) {
    return (
      <div className="app-layout">
        <div className="app-content-wrapper">
          <Navbar />
          <div className="film-detail-container loading-state">
            <div className="loading">Caricamento...</div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !todo) {
     return (
      <div className="app-layout">
        <div className="app-content-wrapper">
          <Navbar />
          <div className="film-detail-container error-state">
            <h1>{error || 'Film non trovato'}</h1>
            <button className="film-back-button" onClick={() => navigate('/home')}>
              <span className="film-back-arrow"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  let image = filmImages[1];
  let title = todo.title;
  
  // ... (logica mappatura immagini) ...
    if (todosForMapping.length > 0) {
    const todoIndex = todosForMapping.findIndex(t => t.id === todo.id);
    if (todoIndex !== -1) {
      if (todoIndex < 5) {
        image = filmImages[todoIndex + 1];
      } else {
        image = filmImages[todoIndex - 5 + 6];
      }
    }
  } else {
    if (todo.id <= 5) {
      image = filmImages[todo.id];
    } else {
      image = filmImages[todo.id - 5 + 6];
    }
  }
  
  // Definiamo 'filmReviewsList' come un array vuoto
  // o come l'array esistente, se è un array.
  const filmReviewsList = Array.isArray(reviews[todoId]) ? reviews[todoId] : [];


  return (
    <div className="app-layout">
      <div className="app-content-wrapper">
        <Navbar />
        <div className="film-detail-container" style={{ backgroundImage: `url(${image})` }}>
          <div className="film-detail-overlay"></div>
          <button className="film-back-button" onClick={() => navigate('/home')} aria-label="Torna alla Home">
            <span className="film-back-arrow"></span>
          </button>
          
          <div className="film-detail-scroll-content">
            <div className="film-detail-info">
              <h1 className="film-detail-title">{title}</h1>
              <div className="film-detail-meta">
                <div className="film-detail-meta-left">
                  <span className={`film-status ${todo.completed ? 'completed' : 'in-progress'}`}>
                    {todo.completed ? '✓ Completato' : '○ In corso'}
                  </span>
                  <span className="film-id">ID: {todo.id}</span>
                </div>
              </div>
              <p className="film-detail-description">
                Questo è il dettaglio del film "{title}" dalla lista. 
                Qui puoi aggiungere informazioni aggiuntive come descrizione, cast, regista, anno di uscita, ecc.
              </p>
            </div>

            {/* --- SEZIONE RECENSIONE (con stelline incluse) --- */}
            <div className="film-review-section">
              <h2 className="film-review-title">Le tue recensioni</h2>

              {/* Stelline */}
              <div className="film-detail-rating" role="radiogroup" aria-label="Valutazione film">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`film-rating-star ${currentRating >= star ? 'active' : ''}`}
                    onClick={() => handleRate(star)}
                    aria-label={`Valuta ${star} su 5`}
                    aria-checked={currentRating === star}
                    role="radio"
                  >
                    {currentRating >= star ? '★' : '☆'}
                  </button>
                ))}
                <span className="film-rating-label">
                  {currentRating ? `${currentRating} / 5` : 'Nessuna valutazione'}
                </span>
              </div>

              {/* Mappa e mostra le recensioni salvate */}
              <div className="film-review-list">
                
                {/* Ora controlliamo la lunghezza di 'filmReviewsList' */}
                {(filmReviewsList.length === 0) && !editingReview && (
                  <p className="film-review-empty">Nessun commento ancora.</p>
                )}
                
                {/* Usiamo 'filmReviewsList' per mappare. È garantito che sia un array. */}
                {filmReviewsList.map(review => (
                  <div className="film-review-item" key={review.id}>
                    <p className="film-review-item-text">{review.text}</p>
                    <div className="film-review-actions">
                      <button 
                        onClick={() => handleEditReview(review)} 
                        className="film-review-action-btn edit"
                        disabled={editingReview != null}
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review.id)} 
                        className="film-review-action-btn delete"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form per aggiungere/modificare recensione */}
              <form className="film-review-form" onSubmit={handleSubmitReview}>
                <label htmlFor="review-text" className="film-review-label">
                  {editingReview ? 'Modifica il tuo commento:' : 'Aggiungi un commento:'}
                </label>
                <textarea
                  id="review-text"
                  className="film-review-input"
                  value={currentReviewText}
                  onChange={(e) => setCurrentReviewText(e.target.value)}
                  placeholder="Scrivi qui..."
                  rows="4"
                />
                <div className="film-review-form-actions">
                  <button type="submit" className="film-review-submit">
                    {editingReview ? 'Aggiorna recensione' : 'Salva recensione'}
                  </button>
                  {editingReview && (
                    <button type="button" className="film-review-cancel" onClick={handleCancelEdit}>
                      Annulla
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}