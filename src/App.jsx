import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ModeratorPanel from './components/ModeratorPanel';
import PlayerView from './components/PlayerView';
import { GameProvider } from './context/GameContext';

export default function App() {
  const [role, setRole] = useState(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedNickname = localStorage.getItem('nickname');

    if (savedRole && savedNickname) {
      setRole(savedRole);
      setNickname(savedNickname);
    }
  }, []);

  return (
    <GameProvider>
      {!role ? (
        <Login
          onLogin={(r, nick) => {
            setRole(r);
            setNickname(nick);
          }}
        />
      ) : role === 'moderator' ? (
        <ModeratorPanel />
      ) : (
        <PlayerView nickname={nickname} />
      )}
    </GameProvider>
  );
}
