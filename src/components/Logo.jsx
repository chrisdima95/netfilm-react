import { useEffect, useRef, useState } from 'react';
import { interpolate } from 'flubber';

// Path SVG per le due barre Pause
const pauseBar1 = 'M200.12,500.46h24.27a0,0,0,0,1,0,0v79.07a0,0,0,0,1,0,0h-9.27a15,15,0,0,1-15-15V500.46A0,0,0,0,1,200.12,500.46Z'; // Prima barra (sinistra) - posizione Pause
const pauseBar1Play = 'M183.31,500.46h24.27a0,0,0,0,1,0,0v79.07a0,0,0,0,1,0,0h-9.27a15,15,0,0,1-15-15V500.46A0,0,0,0,1,183.31,500.46Z'; // Prima barra (sinistra) - posizione Play (spostata a sinistra)
const pauseBar2 = 'M236,500.46h24.27a0,0,0,0,1,0,0v79.07a0,0,0,0,1,0,0H251a15,15,0,0,1-15-15V500.46A0,0,0,0,1,236,500.46Z'; // Seconda barra (destra) - si trasforma

// Path SVG per il triangolo Play (sostituisce la seconda barra)
const playTriangle = 'M219.18,500.46v79.07l61.7-31.76a8.74,8.74,0,0,0,0-15.54Z';

// Offset per spostare il testo NETFILM (in unità viewBox: 1080x1080)
// Convertito in percentuale per il viewBox
const textOffsetPercent = (16.81 / 1080) * 100; // Circa 1.56% del viewBox

export default function Logo({ size = 'normal', onAnimationComplete, animate = false }) {
  const svgRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const bar1Ref = useRef(null); // Prima barra (rimane ferma)
  const bar2Ref = useRef(null); // Seconda barra (si trasforma in triangolo)
  const textGroupRef = useRef(null); // Gruppo per il testo NETFILM
  const animationFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const bar1 = bar1Ref.current;
    const bar2 = bar2Ref.current;
    const textGroup = textGroupRef.current;
    if (!bar1 || !bar2 || !textGroup) return;

    // Se l'animazione è disabilitata, mostra lo stato Play statico
    if (!animate) {
      // Sposta la prima barra a sinistra (come nello stato Play)
      const bar1OffsetX = 16.81;
      const bar1OffsetPercent = (bar1OffsetX / 1080) * 100;
      bar1.setAttribute('d', pauseBar1);
      bar1.style.transform = `translate(-${bar1OffsetPercent}%, 0)`;
      // Mostra il triangolo Play invece della seconda barra
      bar2.setAttribute('d', playTriangle);
      // Sposta il testo NETFILM a destra
      textGroup.style.transform = `translate(${textOffsetPercent}%, 0)`;
      return;
    }

    // Se l'animazione è già stata eseguita, non rifarla
    if (hasAnimatedRef.current) return;

    // Funzione per morfare il path usando flubber
    const morphPath = (element, fromPath, toPath, duration, onComplete) => {
      let startTime = null;
      
      // Crea la funzione di interpolazione
      let interpolator;
      try {
        interpolator = interpolate(fromPath, toPath);
      } catch (e) {
        // Se flubber fallisce, usa cambio diretto
        element.setAttribute('d', toPath);
        if (onComplete) onComplete();
        return;
      }
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing easeInOutQuad
        const eased = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
        
        // Interpola il path
        const interpolatedPath = interpolator(eased);
        element.setAttribute('d', interpolatedPath);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          element.setAttribute('d', toPath);
          if (onComplete) onComplete();
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const animateToPlay = () => {
      setIsPlaying(true);
      hasAnimatedRef.current = true;
      
      // Sposta la prima barra a sinistra usando transform (come nell'SVG originale Play)
      // La differenza è 200.12 - 183.31 = 16.81 unità
      const bar1OffsetX = 16.81;
      const bar1OffsetPercent = (bar1OffsetX / 1080) * 100;
      bar1.style.transition = 'transform 2.5s ease-in-out';
      bar1.style.transform = `translate(-${bar1OffsetPercent}%, 0)`;
      
      // Trasforma la seconda barra in triangolo con morphing
      morphPath(bar2, pauseBar2, playTriangle, 2500, () => {
        // Quando l'animazione è completa, chiama il callback
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
      
      // Sposta il testo NETFILM a destra
      textGroup.style.transition = 'transform 2.5s ease-in-out';
      textGroup.style.transform = `translate(${textOffsetPercent}%, 0)`;
    };

    // Inizia con Pause
    bar1.setAttribute('d', pauseBar1);
    bar1.style.transform = 'translate(0, 0)';
    bar2.setAttribute('d', pauseBar2);
    textGroup.style.transform = 'translate(0, 0)';

    // Inizia con Play dopo un breve delay
    setTimeout(() => {
      animateToPlay();
    }, 500);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onAnimationComplete, animate]);

  const sizeStyles = {
    small: { width: '80px', height: 'auto' },
    normal: { width: '120px', height: 'auto' },
    large: { width: '180px', height: 'auto' },
    xlarge: { width: '500px', height: 'auto', maxWidth: '90vw' }
  };

  return (
    <div className="animated-logo" style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        ref={svgRef}
        id="Livello_1"
        data-name="Livello 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1080 1080"
        style={sizeStyles[size]}
      >
        <defs>
          <style>{`.cls-1{fill:#e3b23c;}.cls-2{fill:#fff;}`}</style>
        </defs>
        {/* Seconda barra Pause / Triangolo Play (morphable) - renderizzata per prima */}
        <path ref={bar2Ref} className="cls-1 morphable-path" d={pauseBar2} />
        {/* Prima barra Pause (rimane ferma) - renderizzata per ultima così appare sopra */}
        <path ref={bar1Ref} className="cls-1" d={pauseBar1} />
        {/* Gruppo per il testo NETFILM (spostabile) */}
        <g ref={textGroupRef} className="text-group">
          <path className="cls-2" d="M326.87,579.53,309.82,521.3v58.23H285V500.47h23.2a25,25,0,0,1,7.34,1.12,21.54,21.54,0,0,1,7,3.79,30.84,30.84,0,0,1,6.39,7.16,53.75,53.75,0,0,1,5.51,11.24l9.46,34.92V500.47h24.86V556.1a26.52,26.52,0,0,1-1.65,9.53,21.39,21.39,0,0,1-4.68,7.39,20.92,20.92,0,0,1-7.28,4.8,24.89,24.89,0,0,1-9.35,1.71Z" />
          <path className="cls-2" d="M413.75,558.7h45.69v20.83H402.51a25.18,25.18,0,0,1-8.82-1.47,20.42,20.42,0,0,1-6.93-4.27,18.55,18.55,0,0,1-4.55-6.8,24.77,24.77,0,0,1-1.6-9.23V500.47h78.83V521.3h-54v8.4h54v20.83h-54C405.54,556,408.31,558.7,413.75,558.7Z" />
          <path className="cls-2" d="M548.81,500.47V521.3h-33v29q0,8.52,8.4,8.52h24.5v20.71H524.07q-33.26,0-33.26-29.23v-29H471.28V500.47Z" />
          <path className="cls-2" d="M585.5,550.53v29H560.65V500.47h76.94V521.3H585.5v8.4h52.09v20.83Z" />
          <path className="cls-2" d="M649.42,579.53V500.47h25v79.06Z" />
          <path className="cls-2" d="M711.09,500.47V542a30.71,30.71,0,0,0,.89,8,11.15,11.15,0,0,0,2.9,5.15,11.37,11.37,0,0,0,5.21,2.78,31.08,31.08,0,0,0,7.69.83h31.37v20.71h-35a61,61,0,0,1-17.52-2.18,25.72,25.72,0,0,1-18.29-18.12,55.31,55.31,0,0,1-2.07-16V500.47Z" />
          <path className="cls-2" d="M813,579.53l-17.16-57.88v57.88H771V500.47h23a25,25,0,0,1,7.34,1.12,22.21,22.21,0,0,1,7.1,3.79,31.14,31.14,0,0,1,6.51,7.16,51.83,51.83,0,0,1,5.56,11.24l5,18,5-18A51.37,51.37,0,0,1,836,512.54a31.14,31.14,0,0,1,6.51-7.16,22.1,22.1,0,0,1,7.1-3.79,24.92,24.92,0,0,1,7.34-1.12h23v79.06H855V521.65l-17.17,57.88Z" />
        </g>
      </svg>
    </div>
  );
}
