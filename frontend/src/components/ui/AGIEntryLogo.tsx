import React from 'react';
import { motion } from 'framer-motion';

interface AGIEntryLogoProps {
  className?: string;
}

const AGIEntryLogo: React.FC<AGIEntryLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-[200px] h-[200px] ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-[#2a2a40] rounded-[20px] overflow-hidden"
        animate={{ boxShadow: ['0 0 20px rgba(0, 0, 0, 0.5)', '0 0 40px rgba(255, 255, 255, 0.8)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      >
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-[#ff00cc] to-[#3333ff]"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <div className="absolute top-[10px] left-[10px] text-[24px] text-white font-sans text-shadow-lg">AGI</div>
      <div className="absolute bottom-[10px] right-[10px] text-[24px] text-white font-sans text-shadow-lg">Entry</div>
      <motion.div 
        className="absolute top-0 right-0 w-[100px] h-[100px] border-t-[10px] border-r-[10px] border-t-[#ff00cc] border-r-[#3333ff] rounded-bl-[100%]"
        animate={{ boxShadow: ['0 0 10px rgba(255, 0, 204, 0.8)', '0 0 20px rgba(255, 0, 204, 1)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[100px] h-[100px] border-b-[10px] border-l-[10px] border-b-[#3333ff] border-l-[#ff00cc] rounded-tr-[100%]"
        animate={{ boxShadow: ['0 0 10px rgba(51, 51, 255, 0.8)', '0 0 20px rgba(51, 51, 255, 1)'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </div>
  );
};

export default AGIEntryLogo;
