import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Styles/Televisor_Llamado.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const videoPlaylist = [
  'video1.mp4',
  'video2.mp4',
];

const TelevisorLlamado = () => {
  const [llamados, setLlamados] = useState([]);
  const [voice, setVoice] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const synth = window.speechSynthesis;
  const ultimoAnuncioTimestamp = useRef(null);

  // Cargar voces (sin cambios)
  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      const spanishFemaleVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Female') || v.name.includes('Femenina') || v.name.includes('Laura') || v.name.includes('Paulina')));
      setVoice(spanishFemaleVoice || voices.find(v => v.lang.startsWith('es')));
    };
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  // --- LÓGICA DE POLLING (SOLO OBTIENE DATOS) ---
  useEffect(() => {
    const fetchLlamados = async () => {
      try {
        const response = await axios.get(`${API_URL}/turnos/llamados-tv`);
        setLlamados(response.data); // Simplemente actualiza el estado
      } catch (error) {
        console.error("Error fetching llamados:", error);
      }
    };

    if (audioReady) { // Solo empezar a preguntar si el audio está activado
      fetchLlamados();
      const intervalId = setInterval(fetchLlamados, 3000);
      return () => clearInterval(intervalId);
    }
  }, [audioReady]); // Se ejecuta cuando el audio está listo

  // --- LÓGICA DE VOZ (REACCIONA A LOS CAMBIOS EN 'llamados') ---
  useEffect(() => {
    if (llamados.length > 0 && voice && audioReady) {
      const ultimoLlamado = llamados[0];
      
      if (ultimoLlamado.callTimestamp && ultimoLlamado.callTimestamp !== ultimoAnuncioTimestamp.current) {
        const textoAnuncio = `Turno ${ultimoLlamado.turno.ticket_completo}, ${ultimoLlamado.turno.nombre_preferido}, pasar al módulo ${ultimoLlamado.modulo}`;
        synth.cancel();
        const utterThis = new SpeechSynthesisUtterance(textoAnuncio);
        utterThis.lang = 'es-ES';
        utterThis.pitch = 1;
        utterThis.rate = 0.9;
        utterThis.voice = voice;
        synth.speak(utterThis);
        
        ultimoAnuncioTimestamp.current = ultimoLlamado.callTimestamp;
      }
    }
  }, [llamados, voice, audioReady, synth]); // Este efecto depende de 'llamados'

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoPlaylist.length);
  };

  const handleActivateAudio = () => {
    const dummyUtterance = new SpeechSynthesisUtterance('Sonido activado');
    dummyUtterance.volume = 0;
    synth.speak(dummyUtterance);
    setAudioReady(true);
  };

  const ultimoLlamado = llamados[0];

  if (!audioReady) {
    return (
      <div className="activate-audio-container">
        <button onClick={handleActivateAudio}>Activar Sonido y Empezar</button>
      </div>
    );
  }

  return (
    <div className="televisor-container">
      <div className="left-panel">
        <video
          key={currentVideoIndex}
          className="background-video"
          autoPlay
          muted
          onEnded={handleVideoEnd}
        >
          <source src={`/videos/${videoPlaylist[currentVideoIndex]}`} type="video/mp4" />
        </video>
        
        <div className={`current-call-overlay ${ultimoLlamado ? 'highlight' : ''}`}>
          {ultimoLlamado ? (
            <>
              <div className="ticket-actual">{ultimoLlamado.turno.ticket_completo}</div>
              <div className="nombre-actual">{ultimoLlamado.turno.nombre_preferido}</div>
              <div className="modulo-actual">{ultimoLlamado.modulo}</div>
            </>
          ) : (
            <div className="esperando-llamado">Esperando turnos...</div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="history-cards-container">
          {llamados.map((llamado) => (
            <div key={llamado.turno.id} className={`history-card ${llamado.turno.id === ultimoLlamado?.turno.id ? 'highlight' : ''}`}>
              <div className="card-ticket">{llamado.turno.ticket_completo}</div>
              <div className="card-main-info">
                <div className="card-nombre">{llamado.turno.nombre_preferido}</div>
                <div className="card-modulo">{llamado.modulo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelevisorLlamado;
