import { useState } from "react";
import logo3D from "../assets/logo-3d.png";

export default function Login({ onLogin }) {
  const [nickname, setNickname] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4"
      style={{ backgroundColor: "#fff7db" }}
    >
      {/* Imagen */}
      <div className="mb-6 lg:mb-0 lg:mr-8">
        <img
          src={logo3D}
          alt="logo-3d"
          className="w-32 h-32 lg:w-80 lg:h-80"
        />
      </div>

      {/* Formulario */}
      <div className="text-center lg:text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 font-gamer">
          Prode a medida
        </h1>

        <div className="rounded-lg p-6 w-full max-w-sm">
          <input
            type="text"
            placeholder="Tu apodo"
            className="border border-gray-300 rounded text-xl px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-[#263956]"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <button
            onClick={() => onLogin("player", nickname)}
            className="w-full  bg-[#1e2c45] hover:bg-[#263956] text-white font-semibold py-2 rounded transition font-gamer"
          >
            Jugar
          </button>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #ccc",
              margin: "20px",
            }}
          />
          <button
            onClick={() => onLogin("moderator", nickname)}
            className="w-full bg-[#3aae5f] hover:bg-green-700 text-white font-semibold py-2 rounded transition font-gamer"
          >
            Moderador
          </button>
        </div>
      </div>
    </div>
  );
}
