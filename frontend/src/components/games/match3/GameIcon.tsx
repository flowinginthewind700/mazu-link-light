"use client";

import { useState } from "react";
import GameModal from "./GameModal";

interface GameIconProps {
  className?: string;
}

export default function GameIcon({ className }: GameIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(true)}
        className="font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
      >
        <span className="text-2xl walk-animation">🐾</span>
      </button>
      {isOpen && <GameModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}