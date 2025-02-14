// GameIcon.tsx
"use client";

import { useState } from "react";
import GameModal from "./GameModal";
import Match3Game from "./Match3Game";

export default function GameIcon({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-transparent hover:opacity-80 font-bold py-2 px-4 rounded-full transition duration-300"
        style={{ color: "#00aaff" }} // 科技蓝色
      >
        <span className="text-2xl">🐾</span>
      </button>
      {isOpen && (
        <GameModal onClose={() => setIsOpen(false)}>
          <Match3Game initialState={null} onStateChange={() => {}} />
        </GameModal>
      )}
    </div>
  );
}
