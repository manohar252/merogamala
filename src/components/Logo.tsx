import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium', onClick }) => {
  const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div 
      className={`flex items-center cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      <img 
        src="/mero-gamalaa-logo.svg" 
        alt="MERO GAMALAA - Bringing greenery to your home"
        className={`${sizeClasses[size as keyof typeof sizeClasses]} object-contain`}
      />
    </div>
  );
};

export default Logo;