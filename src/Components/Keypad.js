import React from 'react';
import './Keypad.css';

const Keypad = ({ onKeyPress, onClear, onConfirm }) => {
  // El botón 'Aceptar' se ha quitado de la cuadrícula
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Borrar', '0'];

  const handleKeyClick = (key) => {
    if (key === 'Borrar') {
      onClear();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="keypad-wrapper">
      <div className="keypad">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyClick(key)}
            className={`keypad-button ${key === 'Borrar' ? 'keypad-button-clear' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>
      {/* El botón de confirmar ahora está fuera de la cuadrícula */}
      <button onClick={onConfirm} className="keypad-button-accept">
        Aceptar
      </button>
    </div>
  );
};

export default Keypad;
