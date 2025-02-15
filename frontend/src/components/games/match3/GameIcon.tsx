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

      <style jsx>{`
        @keyframes walk {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-15deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .walk-animation {
          animation: walk 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}