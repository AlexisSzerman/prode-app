import React, { useState } from 'react';
import Login from './components/Login';
import ModeratorPanel from './components/ModeratorPanel';
import PlayerView from './components/PlayerView';
import { GameProvider } from './context/GameContext';

export default function App() {
  const [role, setRole] = useState(null);
  const [nickname, setNickname] = useState('');

  return (
    <GameProvider>
      {!role ? (
        <Login onLogin={(r, nick) => {
          setRole(r);
          setNickname(nick);
        }} />
      ) : role === 'moderator' ? (
        <ModeratorPanel />
      ) : (
        <PlayerView nickname={nickname} />
      )}
    </GameProvider>
  );
}
