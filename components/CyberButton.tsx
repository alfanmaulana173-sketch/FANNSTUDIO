import React from 'react';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'pink' | 'green';
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'cyan', 
  isActive = false, 
  disabled = false,
  className = '' 
}) => {
  const colors = {
    cyan: 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black shadow-[0_0_5px_#00f3ff]',
    pink: 'border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black shadow-[0_0_5px_#ff00ff]',
    green: 'border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black shadow-[0_0_5px_#0aff0a]'
  };

  const activeClasses = isActive 
    ? `bg-cyber-${variant} text-black shadow-[0_0_15px_currentColor]` 
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-2 font-display font-bold uppercase tracking-wider
        border-2 transition-all duration-200 cyber-border
        disabled:opacity-50 disabled:cursor-not-allowed
        ${colors[variant]}
        ${activeClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
