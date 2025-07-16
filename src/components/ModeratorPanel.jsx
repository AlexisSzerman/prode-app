import React, { useState, useEffect } from 'react';
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
    gameFinished,
  } = useGame();

  const [newPrediction, setNewPrediction] = useState('');
  const [newPoints, setNewPoints] = useState(1);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Cargar estado de autenticación al montar
  useEffect(() => {
    const savedAuth = localStorage.getItem('moderatorAuth');
    if (savedAuth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: '#fff7db' }}>
        <h1 className="text-2xl font-bold mb-4 font-gamer">Acceso Moderador</h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="border p-2 mb-4 rounded text-xl"
        />
        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setAuthenticated(true);
              setError('');
              localStorage.setItem('moderatorAuth', 'true'); // Guardar autenticación
            } else {
              setError('Contraseña incorrecta');
            }
          }}
          className="bg-[#3aae5f] hover:bg-green-700 font-gamer text-white px-4 py-2 rounded mb-2 "
        >
          Entrar
        </button>
        {error && <div className="text-red-600 text-xl">{error}</div>}
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
            className="border p-2 flex-1 text-xl"
            placeholder="Agregar nueva predicción"
          />
          <select
            value={newPoints}
            onChange={e => setNewPoints(Number(e.target.value))}
            className="border p-2 text-lgrounded"
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
            className="bg-[#3aae5f] hover:bg-green-700 text-white text-xl px-4 py-2 rounded whitespace-nowrap"
          >
            Agregar
          </button>
        </div>

<ul className="space-y-2 mb-6 text-xl">
  {predictions.map((p, i) => (
    <li
      key={i}
      className={`p-3 border rounded ${p.correct ? 'bg-green-100' : 'bg-white'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Texto de la predicción */}
        <span className="flex-1 text-left">
          {p.text}{' '}
          <span className="text-gray-500 text-lg">({p.points || 1} pts)</span>
        </span>

        {/* Controles */}
        <div className="flex flex-wrap gap-2 items-center justify-end">
          {!p.correct && (
            <select
              value={p.points || 1}
              onChange={e => updatePredictionPoints(i, Number(e.target.value))}
              className="border p-1 rounded text-base"
            >
              {[1, 2, 3, 4, 5].map(val => (
                <option key={val} value={val}>{val} punto{val > 1 ? 's' : ''}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => toggleCorrect(i)}
            className="bg-green-500 text-white px-3 py-1 rounded text-base"
          >
            {p.correct ? '✓ Correcta' : 'Marcar'}
          </button>

          <button
            onClick={() => removePrediction(i)}
            className="bg-red-500 text-white px-3 py-1 rounded text-base"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  ))}
</ul>

        <h2 className="text-xl font-semibold mb-2 font-gamer">Apuestas acertadas</h2>
        <ul className="space-y-2 text-xl">
          {players.map((p, i) => {
            const aciertos = p.selected.filter((idx) => predictions[idx]?.correct);
            return (
              <li key={i} className="border p-2 rounded text-2xl">
                <strong>{p.nickname}</strong>
                {aciertos.length > 0 ? (
                  <ul className="ml-4 list-disc">
                    {aciertos.map((idx) => (
                      <li key={idx}>
                        {predictions[idx]?.text}
                        <span className="text-lg text-gray-500"> ({predictions[idx]?.points || 1} pts)</span>
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
                <li key={nick} className={`text-lg border p-2 rounded flex justify-between items-center ${bgColor}`}>
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
            className="bg-[#1e2c45] hover:bg-[#263956] text-white px-4 py-2 rounded"
          >
            Finalizar Partida
          </button>
        </div>

        {gameFinished && (
          <div className="mb-4 m-4 p-4 bg-red-200 border border-red-400 text-red-800 rounded font-bold font-gamer text-center">
            🚨 GAME OVER: La partida ha finalizado 🚨
          </div>
        )}

        {/* Botón salir */}
        <button
          onClick={() => {
            localStorage.removeItem('nickname');
            localStorage.removeItem('role');
            localStorage.removeItem('moderatorAuth'); // limpiar también esta
            window.location.reload();
          }}
          className="mt-6 bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Salir
        </button>
      </div>
    </div>
  );
}
