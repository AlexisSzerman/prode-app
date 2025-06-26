import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function PlayerView({ nickname }) {
  const { predictions, confirmPlayerChoices, scores } = useGame();
  const [selected, setSelected] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const MAX_SELECTIONS = 5;

  const toggleSelect = (index) => {
    if (confirmed) return;

    setSelected((prev) => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < MAX_SELECTIONS) {
        return [...prev, index];
      } else {
        alert(`Solo podés elegir ${MAX_SELECTIONS} predicciones.`);
        return prev;
      }
    });
  };

  const confirm = () => {
    confirmPlayerChoices(nickname, selected);
    setConfirmed(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {nickname}</h1>

      {confirmed ? (
        <>
          <h2 className="text-xl mb-2">Tus Apuestas Acertadas</h2>

          {selected.filter((i) => predictions[i]?.correct).length > 0 ? (
            <ul className="space-y-2">
              {selected
                .filter((i) => predictions[i]?.correct)
                .map((i) => (
                  <li key={i} className="p-2 border rounded flex justify-between items-center bg-green-50">
                    <span>
                      {predictions[i].text}{' '}
                      <span className="text-xs text-gray-500">({predictions[i].points || 1} pts)</span>
                    </span>
                    <span className="text-green-600 font-bold">✓ +{predictions[i].points || 1}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-red-600 font-semibold mb-4">No acertaste ninguna predicción esta vez.</p>
          )}

          <h3 className="mt-4 text-lg">
            Puntaje total: <strong>{scores[nickname] ?? 0}</strong>
          </h3>

          <h2 className="text-xl font-semibold mt-6 mb-2">Leaderboard</h2>
          <ul className="space-y-1">
            {Object.entries(scores)
              .sort(([, a], [, b]) => b - a)
              .map(([nick, score], idx) => {
                const medals = ['🥇', '🥈', '🥉'];
                const bgColor = idx === 0 ? 'bg-yellow-100' : idx === 1 ? 'bg-gray-200' : idx === 2 ? 'bg-orange-100' : '';
                return (
                  <li key={nick} className={`border p-2 rounded flex justify-between items-center ${bgColor}`}>
                    <div className="flex items-center gap-2">
                      {medals[idx] && <span>{medals[idx]}</span>}
                      <span>{nick}</span>
                    </div>
                    <span className="font-bold">{score} pts</span>
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <>
          <p className="mb-2">Selecciona hasta {MAX_SELECTIONS} predicciones que creés que van a pasar:</p>
          <p className="text-sm text-gray-600 mb-2">
            Elegiste {selected.length} de {MAX_SELECTIONS} predicciones
          </p>
          <ul className="space-y-2">
            {predictions.map((p, i) => (
              <li key={i} className="p-2 border rounded flex justify-between items-center">
                <span>{p.text} <span className="text-xs text-gray-500">({p.points || 1} pts)</span></span>
                <input
                  type="checkbox"
                  checked={selected.includes(i)}
                  onChange={() => toggleSelect(i)}
                />
              </li>
            ))}
          </ul>
          <button
            onClick={confirm}
            disabled={selected.length === 0}
            className={`mt-4 px-4 py-2 rounded text-white ${
              selected.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirmar Apuestas
          </button>
        </>
      )}
    </div>
  );
}
