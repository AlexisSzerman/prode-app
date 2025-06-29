import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const ADMIN_PASSWORD = 'admin123';

export default function ModeratorPanel() {
  const {
    predictions,
    addPrediction,
    toggleCorrect,
    updatePredictionPoints,
    players,
    scores,
    resetRound,
    removePrediction,
    finishGame,
  } = useGame();

  const [newPrediction, setNewPrediction] = useState('');
  const [newPoints, setNewPoints] = useState(1);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: '#fff7db' }}>
        <h1 className="text-2xl font-bold mb-4 font-gamer">Acceso Moderador</h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="border p-2 mb-4 rounded"
        />
        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setAuthenticated(true);
              setError('');
            } else {
              setError('Contraseña incorrecta');
            }
          }}
          className="bg-[#3aae5f] hover:bg-green-700 font-gamer text-white px-4 py-2 rounded mb-2 "
        >
          Entrar
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    );
  }

  return (
  <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#fff7db' }}>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 font-gamer">Panel de Moderador</h1>

      <div className="flex gap-2 mb-4 flex-col sm:flex-row">
        <input
          type="text"
          value={newPrediction}
          onChange={(e) => setNewPrediction(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Agregar nueva predicción"
        />
        <select
          value={newPoints}
          onChange={e => setNewPoints(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map(p => (
            <option key={p} value={p}>{p} punto{p > 1 ? 's' : ''}</option>
          ))}
        </select>
        <button
          onClick={() => {
            addPrediction(newPrediction, newPoints);
            setNewPrediction('');
            setNewPoints(1);
          }}
          className="bg-[#3aae5f] hover:bg-green-700 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-2 mb-6">
        {predictions.map((p, i) => (
          <li
            key={i}
            className={`p-2 border rounded flex justify-between items-center ${p.correct ? 'bg-green-100' : ''}`}
          >
            <span>
              {p.text} <span className="text-xs text-gray-500">({p.points || 1} pts)</span>
            </span>
            <div className="flex items-center gap-2">
              {!p.correct && (
                <select
                  value={p.points || 1}
                  onChange={e => updatePredictionPoints(i, Number(e.target.value))}
                  className="border p-1 rounded text-xs"
                >
                  {[1, 2, 3, 4, 5].map(val => (
                    <option key={val} value={val}>{val} punto{val > 1 ? 's' : ''}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => toggleCorrect(i)}
                className="text-sm bg-green-500 text-white px-2 py-1 rounded"
              >
                {p.correct ? '✓ Correcta' : 'Marcar'}
              </button>
              <button
                onClick={() => removePrediction(i)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2 font-gamer">Apuestas acertadas</h2>
      <ul className="space-y-2">
        {players.map((p, i) => {
          const aciertos = p.selected.filter((idx) => predictions[idx]?.correct);
          return (
            <li key={i} className="border p-2 rounded">
              <strong>{p.nickname}</strong>
              {aciertos.length > 0 ? (
                <ul className="ml-4 list-disc">
                  {aciertos.map((idx) => (
                    <li key={idx}>
                      {predictions[idx]?.text}
                      <span className="text-xs text-gray-500"> ({predictions[idx]?.points || 1} pts)</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-600 mt-1 font-gamer">No acertó ninguna predicción.</p>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2 font-gamer">Posiciones</h2>
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

      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <button
          onClick={resetRound}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reiniciar Puntajes
        </button>
        <button
          onClick={() => finishGame()}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Finalizar Partida
        </button>
      </div>
    </div>
  </div>
);
}