import { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function PlayerView({ nickname }) {
  const { predictions, confirmPlayerChoices, scores, gameFinished } = useGame();
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
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4"
      style={{ backgroundColor: "#fff7db" }}>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 font-gamer">Player {nickname} is <span className="text-green-500">online</span></h1>

      {confirmed ? (
        (() => {
          const acertadas = selected.filter((i) => predictions[i]?.correct);
          const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
          const [winnerName, winnerScore] = sortedScores[0] || [];

          if (!gameFinished) {
            if (acertadas.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <p className="text-lg font-semibold text-gray-700">Partida en curso...</p>
                </div>
              );
            }

            return (
              <>
                <h2 className="text-xl mb-2">Tus Apuestas Acertadas</h2>
                <ul className="space-y-2">
                  {acertadas.map((i) => (
                    <li
                      key={i}
                      className="p-2 border rounded flex justify-between items-center text-xl bg-green-50"
                    >
                      <span>
                        {predictions[i].text}{' '}
                        <span className="text-xs text-gray-500">
                          ({predictions[i].points || 1} pts)
                        </span>
                      </span>
                      <span className="text-green-600 font-bold">
                        ✓ +{predictions[i].points || 1}
                      </span>
                    </li>
                  ))}
                </ul>

                <h2 className="text-xl font-semibold font-gamer mt-6 mb-2">Posiciones</h2>
                <ul className="space-y-1 text-2xl">
                  {sortedScores.map(([nick, score], idx) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const bgColor =
                      idx === 0
                        ? 'bg-yellow-100'
                        : idx === 1
                        ? 'bg-gray-200'
                        : idx === 2
                        ? 'bg-orange-100'
                        : '';
                    return (
                      <li
                        key={nick}
                        className={`border p-2 rounded flex text-xl justify-between items-center ${bgColor}`}
                      >
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
            );
          }

          return (
            <div className="flex flex-col items-center py-8">
              <p className="text-3xl font-gamer text-red-600 mb-4 blink">GAME OVER</p>
              {winnerName && (
                <p className="text-xl font-gamer font-semibold text-green-700">
                  🏆 Ganador: {winnerName} ({winnerScore} pts)
                </p>
              )}
            </div>
          );
        })()
      ) : (
        <>
          <p className="mb-2 text-3xl">Selecciona hasta {MAX_SELECTIONS} predicciones que creés que van a suceder:</p>
          <p className="text-xl text-gray-600 mb-2">
            Elegiste {selected.length} de {MAX_SELECTIONS} predicciones
          </p>
          <ul className="space-y-2 text-2xl">
            {predictions.map((p, i) => (
              <li key={i} className="p-2 border rounded flex justify-between items-center text-2xl">
                <span>{p.text} <span className="text-2xl text-gray-500">({p.points || 1} pts)</span></span>
                <input
                  type="checkbox"
                  checked={selected.includes(i)}
                  onChange={() => toggleSelect(i)}
                />
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
  <button
    onClick={confirm}
    disabled={selected.length === 0}
    className={`px-4 py-2 text-2xl rounded text-white font-gamer ${
      selected.length === 0
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-[#1e2c45] hover:bg-[#263956]'
    }`}
  >
    Confirmar Apuestas
  </button>

  <button
    onClick={() => {
      localStorage.removeItem('nickname');
      localStorage.removeItem('role');
      window.location.reload();
    }}
    className="px-4 py-2 text-2xl rounded text-white bg-gray-400 hover:bg-gray-600 font-gamer"
  >
    Salir
  </button>
</div>

        </>
      )}
    </div>
    </div>
  );
}
