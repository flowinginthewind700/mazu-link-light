import React from 'react';
import { motion } from 'framer-motion';

interface AGIEntryLogoProps {
  className?: string;
}

const AGIEntryLogo: React.FC<AGIEntryLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-[64px] h-[64px] ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-[#2a2a40] rounded-[13px] overflow-hidden"
        animate={{ boxShadow: ['0 0 13px rgba(0, 0, 0, 0.5)', '0 0 26px rgba(255, 255, 255, 0.8)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-[#ff00cc] to-[#3333ff]"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ zIndex: -1 }}
        />
      </motion.div>
      <div 
        className="absolute top-[6.5px] left-[6.5px] text-[18px] text-white font-sans font-bold" 
        style={{ textShadow: '0 0 6.5px rgba(255, 255, 255, 0.8)' }}
      >
        AGI
      </div>
      <div 
        className="absolute bottom-[6.5px] right-[6.5px] text-[18px] text-white font-sans font-bold" 
        style={{ textShadow: '0 0 6.5px rgba(255, 255, 255, 0.8)' }}
      >
        Entry
      </div>
      <motion.div 
        className="absolute top-0 right-0 w-[65px] h-[65px] border-t-[6.5px] border-r-[6.5px] border-t-[#ff00cc] border-r-[#3333ff] rounded-bl-[65px]"
        animate={{ boxShadow: ['0 0 6.5px rgba(255, 0, 204, 0.8)', '0 0 13px rgba(255, 0, 204, 1)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[65px] h-[65px] border-b-[6.5px] border-l-[6.5px] border-b-[#3333ff] border-l-[#ff00cc] rounded-tr-[65px]"
        animate={{ boxShadow: ['0 0 6.5px rgba(51, 51, 255, 0.8)', '0 0 13px rgba(51, 51, 255, 1)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </div>
  );
};

export default AGIEntryLogo;
