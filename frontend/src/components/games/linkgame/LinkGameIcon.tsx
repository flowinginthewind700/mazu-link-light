"use client";

import { useState } from "react";
import LinkGameModal from "./LinkGameModal";

interface LinkGameIconProps {
  className?: string; // 添加 className 属性
}

export default function LinkGameIcon({ className }: LinkGameIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}> {/* 将 className 应用到根元素 */}
      <button
        onClick={() => setIsOpen(true)}
        className="font-bold py-1 px-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
      >
        <span className="text-2xl walk-animation">🔗</span>
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