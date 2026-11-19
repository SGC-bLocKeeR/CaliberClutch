import React, { useState } from 'react';

export interface CountryFlagProps {
  code?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code = 'XK',
  name,
  className = '',
  size = 'md'
}) => {
  const [useRemote, setUseRemote] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || 'XK').toUpperCase().trim();
  const lowerCode = cleanCode.toLowerCase();

  const sizeClasses = {
    xs: 'w-4 h-2.5 rounded-[2px]',
    sm: 'w-4.5 h-3 rounded-[2px]',
    md: 'w-5 h-3.5 rounded-[2px]',
    lg: 'w-6 h-4 rounded-[3px]',
    xl: 'w-8 h-5.5 rounded-[3px]'
  }[size];

  // Guaranteed inline SVG fallback for Kosovo (XK)
  if (hasError && cleanCode === 'XK') {
    return (
      <svg 
        viewBox="0 0 600 400" 
        className={`inline-block ${sizeClasses} ${className} border border-white/10 shadow-sm align-middle shrink-0`}
      >
        <title>{name || 'Kosovo'}</title>
        <rect width="600" height="400" fill="#002B7F"/>
        <path d="M190 270 L210 230 L270 200 L320 220 L350 190 L390 230 L370 270 L300 290 Z" fill="#D0A93E"/>
        <g fill="#FFFFFF">
          <circle cx="240" cy="150" r="10"/>
          <circle cx="270" cy="140" r="10"/>
          <circle cx="300" cy="135" r="10"/>
          <circle cx="330" cy="140" r="10"/>
          <circle cx="360" cy="150" r="10"/>
          <circle cx="390" cy="165" r="10"/>
        </g>
      </svg>
    );
  }

  // Guaranteed inline SVG fallback for Albania (AL)
  if (hasError && cleanCode === 'AL') {
    return (
      <svg 
        viewBox="0 0 600 400" 
        className={`inline-block ${sizeClasses} ${className} border border-white/10 shadow-sm align-middle shrink-0`}
      >
        <title>{name || 'Albania'}</title>
        <rect width="600" height="400" fill="#DA291C"/>
        <circle cx="300" cy="200" r="60" fill="#000000"/>
      </svg>
    );
  }

  if (hasError) {
    return (
      <span 
        className={`inline-flex items-center justify-center bg-slate-800 border border-white/10 text-[10px] font-mono text-slate-300 font-bold ${sizeClasses} ${className}`}
        title={name || cleanCode}
      >
        🏳️
      </span>
    );
  }

  const src = useRemote 
    ? `https://flagcdn.com/w40/${lowerCode}.png`
    : `/images/flags/${lowerCode}.png`;

  return (
    <img
      src={src}
      srcSet={useRemote ? `https://flagcdn.com/w80/${lowerCode}.png 2x` : undefined}
      alt={name || cleanCode}
      title={name || cleanCode}
      loading="lazy"
      onError={() => {
        if (!useRemote) {
          setUseRemote(true);
        } else {
          setHasError(true);
        }
      }}
      className={`inline-block object-cover border border-white/15 shadow-sm align-middle shrink-0 ${sizeClasses} ${className}`}
    />
  );
};
