import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState('');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ingreso</h1>
      <input
        type="text"
        placeholder="Tu apodo"
        className="border p-2 mb-4 block w-full"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => onLogin('player', nickname)}
        >
          Entrar como Jugador
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => onLogin('moderator', nickname)}
        >
          Entrar como Moderador
        </button>
      </div>
    </div>
  );
}