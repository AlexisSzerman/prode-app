import { createContext, useState, useContext, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GameContext = createContext();
const SECRET_KEY = 'admin123'; // clave que coincide con las reglas de Firestore
const GAME_DOC = doc(db, 'game', 'room');

export function GameProvider({ children }) {
  const [predictions, setPredictions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameFinished, setGameFinished] = useState(false);

  // Función para calcular los scores
  const calculateScores = (preds, pls) => {
    const result = {};
    pls.forEach(player => {
      let score = 0;
      player.selected.forEach(idx => {
        if (preds[idx]?.correct) score += preds[idx]?.points || 1;
      });
      result[player.nickname] = score;
    });
    return result;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(GAME_DOC, (docSnap) => {
      const data = docSnap.data();
      if (data) {
        setPredictions(data.predictions || []);
        setPlayers(data.players || []);
        setScores(data.scores || {});
        setGameFinished(data.gameFinished || false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Actualizar scores cada vez que cambian predicciones o jugadores
  useEffect(() => {
    const newScores = calculateScores(predictions, players);
    setScores(newScores);
    updateGameData({ predictions, players, scores: newScores, gameFinished, });
    // eslint-disable-next-line
  }, [predictions, players]);

const updateGameData = async (newData) => {
  await setDoc(GAME_DOC, {
    ...newData,
    secretKey: SECRET_KEY,
  }, { merge: true }); // ← esta línea es el cambio clave
};

  const addPrediction = async (text, points = 1) => {
    const updated = [...predictions, { text: text.trim(), correct: false, points }];
    setPredictions(updated);
    await updateGameData({ predictions: updated, players, scores, gameFinished });
  };

  const updatePredictionPoints = async (index, points) => {
    const updated = predictions.map((p, i) =>
      i === index ? { ...p, points } : p
    );
    setPredictions(updated);
    await updateGameData({ predictions: updated, players, scores, gameFinished });
  };

  const toggleCorrect = async (index) => {
    const updated = predictions.map((p, i) =>
      i === index ? { ...p, correct: !p.correct } : p
    );
    setPredictions(updated);
    await updateGameData({ predictions: updated, players, scores, gameFinished });
  };

  const confirmPlayerChoices = async (nickname, selected) => {
    const alreadyExists = players.some((p) => p.nickname === nickname);
    if (alreadyExists) return;

    const updated = [...players, { nickname, selected }];
    setPlayers(updated);
    await updateGameData({ predictions, players: updated, scores, gameFinished });
  };

  const resetRound = async () => {
    const clearedPredictions = predictions.map(p => ({ ...p, correct: false }));
    setPredictions(clearedPredictions);
    setPlayers([]);
    setGameFinished(false);
    await updateGameData({ predictions: clearedPredictions, players: [], scores: {}, gameFinished: false });
  };

  const finishGame = async () => {
    setGameFinished(true);
    await updateGameData({ predictions, players, scores, gameFinished: true });
  };

  const removePrediction = async (index) => {
    const updated = predictions.filter((_, i) => i !== index);
    setPredictions(updated);
    await updateGameData({ predictions: updated, players, scores, gameFinished });
  };

  return (
    <GameContext.Provider value={{
      predictions,
      players,
      scores,
      gameFinished,
      addPrediction,
      updatePredictionPoints,
      toggleCorrect,
      confirmPlayerChoices,
      resetRound,
      finishGame,
      removePrediction,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);

