"use client";

import { useState } from "react";
import LinkGameModal from "./LinkGameModal";

export default function LinkGameIcon() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-110 bg-purple-500 hover:bg-purple-600 text-white"
      >
        <span className="text-2xl walk-animation mr-2">🔗</span>
        Play Link Game
      </button>
      {isOpen && <LinkGameModal onClose={() => setIsOpen(false)} />}

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