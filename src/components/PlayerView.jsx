import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function PlayerView({ nickname }) {
  const {
    predictions,
    confirmPlayerChoices,
    players,
    gameFinished,
  } = useGame();

  const [selected, setSelected] = useState([]);

  const handleToggle = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    confirmPlayerChoices(nickname, selected);
  };

  const alreadyPlayed = players.some(p => p.nickname === nickname);

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#fff7db' }}>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 font-gamer">Bienvenido, {nickname}</h1>

        {gameFinished && (
          <div className="mb-4 p-4 bg-red-200 border border-red-400 text-red-800 rounded font-bold font-gamer">
            🚨 GAME OVER: La partida ha finalizado 🚨
          </div>
        )}

        {!gameFinished && alreadyPlayed ? (
          <p className="text-xl text-green-700 font-gamer">Ya enviaste tus elecciones. Esperá resultados.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 font-gamer">Elegí tus apuestas</h2>
            <ul className="space-y-2 text-left mb-4">
              {predictions.map((p, i) => (
                <li
                  key={i}
                  className={`p-3 border rounded cursor-pointer text-xl ${
                    selected.includes(i) ? 'bg-blue-100 border-blue-400' : 'bg-white'
                  }`}
                  onClick={() => handleToggle(i)}
                >
                  {p.text}
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubmit}
              disabled={selected.length === 0 || alreadyPlayed}
              className="bg-[#1e2c45] hover:bg-[#263956] text-white px-4 py-2 rounded text-xl font-gamer disabled:opacity-50"
            >
              Enviar elecciones
            </button>
          </>
        )}

        {/* 🔘 Botón Salir */}
        <button
          onClick={() => {
            localStorage.removeItem('nickname');
            localStorage.removeItem('role');
            window.location.reload();
          }}
          className="mt-6 bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded font-gamer"
        >
          Salir
        </button>
      </div>
    </div>
  );
}
