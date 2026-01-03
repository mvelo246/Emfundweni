import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 60, showText = true, className = '' }) => {
  return (
    <img
      src="/logo.png"
      alt="Emfundweni High School Logo"
      width={size}
      height={showText ? size * 1.3 : size * 0.9}
      className={className}
      style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
      onError={(e) => {
        // If image fails to load, hide it
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};

export default Logo;
