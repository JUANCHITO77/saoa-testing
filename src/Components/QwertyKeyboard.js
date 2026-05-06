import React from 'react';
import './QwertyKeyboard.css';

const QwertyKeyboard = ({ onKeyPress, onBackspace, onConfirm }) => {
  const layout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="qwerty-keyboard">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} onClick={() => onKeyPress(key)} className="key-button">
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button onClick={onBackspace} className="key-button special-key">Borrar</button>
        <button onClick={() => onKeyPress(' ')} className="key-button space-key">Espacio</button>
        <button onClick={onConfirm} className="key-button special-key accept-key">Aceptar</button>
      </div>
    </div>
  );
};

export default QwertyKeyboard;
