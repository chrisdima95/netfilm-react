import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos } from '../api/jsonplaceholder';
import Navbar from '../components/Navbar';
import { useLoginModal } from '../context/LoginModalContext';
import './Home.css';
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

export default function Home() {
  const navigate = useNavigate();
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const containerRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const { authenticated, open } = useLoginModal();

  useEffect(() => {
    const container = containerRef.current;
    const leftSection = leftSectionRef.current;
    const rightSection = rightSectionRef.current;

    if (!container || !leftSection || !rightSection) return;

    // Assicurati che le sezioni siano scrollabili
    const ensureScrollable = () => {
      // Forza il calcolo dell'altezza del contenuto
      leftSection.style.height = '100vh';
      rightSection.style.height = '100vh';
    };

    ensureScrollable();

    // Calcola l'altezza di un singolo set di immagini (5 immagini)
    const getSingleSetHeight = () => {
      // 5 immagini * 75vh + 4 gap * 18px
      return 5 * (window.innerHeight * 0.75) + 4 * 18;
    };

    // Inizia lo scroll dal secondo set per permettere il loop
    const singleSetHeight = getSingleSetHeight();
    leftSection.scrollTop = singleSetHeight;
    rightSection.scrollTop = singleSetHeight;

    let isAdjusting = false;

    const handleScrollLoop = (section) => {
      if (isAdjusting) return;
      
      const singleSetHeight = getSingleSetHeight();
      const currentScroll = section.scrollTop;
      
      // Se siamo alla fine del terzo set, resetta al secondo set
      if (currentScroll >= singleSetHeight * 2 - section.clientHeight) {
        isAdjusting = true;
        section.scrollTop = currentScroll - singleSetHeight;
        requestAnimationFrame(() => {
          isAdjusting = false;
        });
      }
      // Se siamo all'inizio del primo set, resetta al secondo set
      else if (currentScroll <= 0) {
        isAdjusting = true;
        section.scrollTop = currentScroll + singleSetHeight;
        requestAnimationFrame(() => {
          isAdjusting = false;
        });
      }
    };

    const scrollSpeed = 0.8; // Velocità di scroll costante (pixel per evento)
    let isScrolling = false;
    let lastWheelTime = 0;
    const wheelThrottle = 16; // ~60fps

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Throttle per uniformare mouse e touchpad
      const now = Date.now();
      if (now - lastWheelTime < wheelThrottle) {
        return;
      }
      lastWheelTime = now;
      
      // Normalizza il delta in base al deltaMode
      // deltaMode 0 = pixel, 1 = line, 2 = page
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        // Line mode (tipico del mouse)
        delta = delta * 20;
      } else if (e.deltaMode === 2) {
        // Page mode
        delta = delta * window.innerHeight;
      }
      
      // Normalizza il delta per avere un comportamento uniforme
      // Limita il delta massimo per evitare scroll troppo veloci
      const normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 100);
      
      // Usa solo il segno per la direzione, ma normalizza la quantità
      const direction = normalizedDelta > 0 ? 1 : -1;
      const fixedScrollAmount = direction * scrollSpeed * 10;
      
      // Le due colonne vanno sempre in direzioni opposte
      // Quando scrollo in alto (direction < 0): left va in alto, right va in basso
      // Quando scrollo in basso (direction > 0): left va in basso, right va in alto
      
      // Left section: va nella stessa direzione dello scroll
      leftSection.scrollTop += fixedScrollAmount;
      
      // Right section: va in direzione opposta allo scroll
      rightSection.scrollTop -= fixedScrollAmount;
      
      // Applica il loop infinito dopo ogni scroll
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          handleScrollLoop(leftSection);
          handleScrollLoop(rightSection);
          isScrolling = false;
        });
      }
    };

    // Listener per gestire il loop anche durante lo scroll programmatico
    const handleScroll = () => {
      handleScrollLoop(leftSection);
      handleScrollLoop(rightSection);
    };

    leftSection.addEventListener('scroll', handleScroll, { passive: true });
    rightSection.addEventListener('scroll', handleScroll, { passive: true });

    // Previeni scroll normale del body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Aggiungi listener alla window per intercettare tutti gli scroll
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('wheel', handleWheel);
      leftSection.removeEventListener('scroll', handleScroll);
      rightSection.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Carica i todos all'avvio
  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const todosData = await getTodos(10);
      setTodos(todosData);
    } catch (err) {
      console.error('Errore nel caricamento dei todos:', err);
    }
  }

  // Associa ogni immagine a un todo (10 immagini per 10 todos)
  const images = [
    { left: img01, right: img06 },
    { left: img02, right: img07 },
    { left: img03, right: img08 },
    { left: img04, right: img09 },
    { left: img05, right: img10 },
  ];

  // Crea le associazioni: ogni immagine è associata a un todo
  // Le immagini sinistre (1-5) sono associate ai todo 1-5
  // Le immagini destre (6-10) sono associate ai todo 6-10
  const getImageWithTodo = (img, index, side) => {
    const todoIndex = side === 'left' ? index : index + 5;
    const todo = todos[todoIndex] || null;
    return {
      ...img,
      todoId: todo?.id || null,
      todo: todo
    };
  };

  // Duplica le immagini per creare il loop infinito
  const duplicatedImages = [...images, ...images, ...images];

  const handleImageClick = (todoId) => {
    if (!todoId) return;

    if (!authenticated) {
      open(`/home/film/${todoId}`);
      return;
    }

    navigate(`/home/film/${todoId}`);
  };

  return (
    <div className="app-layout">
      <div className="app-content-wrapper">
        <Navbar />
        <div className="home-split-container" ref={containerRef}>
          <div className="home-left-section" ref={leftSectionRef}>
            {duplicatedImages.map((img, index) => {
              const imageWithTodo = getImageWithTodo(img, index % 5, 'left');
              return (
                <div 
                  key={`left-${index}`} 
                  className="home-image-wrapper"
                  onMouseMove={(e) => {
                    const title = e.currentTarget.querySelector('.home-image-title');
                    if (title) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const titleRect = title.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const offsetX = 15;
                      const offsetY = 15;
                      
                      // Calcola la posizione del titolo
                      let titleX = x + offsetX;
                      let titleY = y + offsetY;
                      
                      // Assicurati che il titolo rimanga dentro i margini per evitare cambi di wrapping
                      const titleWidth = titleRect.width || 200; // max-width del titolo
                      const titleHeight = titleRect.height || 50; // altezza stimata
                      
                      // Se il titolo esce dal margine destro, spostalo a sinistra
                      if (titleX + titleWidth > rect.width) {
                        titleX = rect.width - titleWidth - 10;
                      }
                      // Se il titolo esce dal margine sinistro, spostalo a destra
                      if (titleX < 0) {
                        titleX = 10;
                      }
                      // Se il titolo esce dal margine inferiore, spostalo in alto
                      if (titleY + titleHeight > rect.height) {
                        titleY = rect.height - titleHeight - 10;
                      }
                      // Se il titolo esce dal margine superiore, spostalo in basso
                      if (titleY < 0) {
                        titleY = 10;
                      }
                      
                      // Calcola l'opacità in base alla distanza dai margini
                      const margin = 50;
                      const distanceFromLeft = x;
                      const distanceFromRight = rect.width - x;
                      const distanceFromTop = y;
                      const distanceFromBottom = rect.height - y;
                      
                      const minDistance = Math.min(
                        distanceFromLeft,
                        distanceFromRight,
                        distanceFromTop,
                        distanceFromBottom
                      );
                      
                      const opacity = minDistance < margin ? Math.max(0, minDistance / margin) : 1;
                      
                      title.style.left = `${titleX}px`;
                      title.style.top = `${titleY}px`;
                      title.style.opacity = opacity.toString();
                    }
                  }}
                  onMouseLeave={(e) => {
                    const title = e.currentTarget.querySelector('.home-image-title');
                    if (title) {
                      title.style.opacity = '0';
                    }
                  }}
                >
                  <img 
                    src={imageWithTodo.left}
                    alt={imageWithTodo.todo?.title || `Left ${index + 1}`}
                    className="home-image"
                    onClick={() => handleImageClick(imageWithTodo.todoId)}
                  />
                  {imageWithTodo.todo?.title && (
                    <div className="home-image-title">{imageWithTodo.todo.title}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="home-right-section" ref={rightSectionRef}>
            {duplicatedImages.map((img, index) => {
              const imageWithTodo = getImageWithTodo(img, index % 5, 'right');
              return (
                <div 
                  key={`right-${index}`} 
                  className="home-image-wrapper"
                  onMouseMove={(e) => {
                    const title = e.currentTarget.querySelector('.home-image-title');
                    if (title) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const titleRect = title.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const offsetX = 15;
                      const offsetY = 15;
                      
                      // Calcola la posizione del titolo
                      let titleX = x + offsetX;
                      let titleY = y + offsetY;
                      
                      // Assicurati che il titolo rimanga dentro i margini per evitare cambi di wrapping
                      const titleWidth = titleRect.width || 200; // max-width del titolo
                      const titleHeight = titleRect.height || 50; // altezza stimata
                      
                      // Se il titolo esce dal margine destro, spostalo a sinistra
                      if (titleX + titleWidth > rect.width) {
                        titleX = rect.width - titleWidth - 10;
                      }
                      // Se il titolo esce dal margine sinistro, spostalo a destra
                      if (titleX < 0) {
                        titleX = 10;
                      }
                      // Se il titolo esce dal margine inferiore, spostalo in alto
                      if (titleY + titleHeight > rect.height) {
                        titleY = rect.height - titleHeight - 10;
                      }
                      // Se il titolo esce dal margine superiore, spostalo in basso
                      if (titleY < 0) {
                        titleY = 10;
                      }
                      
                      // Calcola l'opacità in base alla distanza dai margini
                      const margin = 50;
                      const distanceFromLeft = x;
                      const distanceFromRight = rect.width - x;
                      const distanceFromTop = y;
                      const distanceFromBottom = rect.height - y;
                      
                      const minDistance = Math.min(
                        distanceFromLeft,
                        distanceFromRight,
                        distanceFromTop,
                        distanceFromBottom
                      );
                      
                      const opacity = minDistance < margin ? Math.max(0, minDistance / margin) : 1;
                      
                      title.style.left = `${titleX}px`;
                      title.style.top = `${titleY}px`;
                      title.style.opacity = opacity.toString();
                    }
                  }}
                  onMouseLeave={(e) => {
                    const title = e.currentTarget.querySelector('.home-image-title');
                    if (title) {
                      title.style.opacity = '0';
                    }
                  }}
                >
                  <img 
                    src={imageWithTodo.right}
                    alt={imageWithTodo.todo?.title || `Right ${index + 1}`}
                    className="home-image"
                    onClick={() => handleImageClick(imageWithTodo.todoId)}
                  />
                  {imageWithTodo.todo?.title && (
                    <div className="home-image-title">{imageWithTodo.todo.title}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
