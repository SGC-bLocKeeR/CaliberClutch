import React from 'react';

interface CyberGridOverlayProps {
  className?: string;
  opacity?: number;
  glowColor?: string;
}

/**
 * CyberGridOverlay - Preserved Tactical Cyber Grid
 * Saved per user request for reuse in Hero or other sections.
 */
export const CyberGridOverlay: React.FC<CyberGridOverlayProps> = ({
  className = "",
  opacity = 0.05,
  glowColor = "#A3E635"
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}>
      {/* 1. Tactical Grid Lines / Squares */}
      <div 
        className="absolute inset-0"
        style={{
          opacity,
          backgroundImage: `
            linear-gradient(to right, #A3E635 1px, transparent 1px),
            linear-gradient(to bottom, #A3E635 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 2. Top-Left Cyber Lime Ambient Radial Aura */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-20"
        style={{ backgroundColor: glowColor }}
      />

      {/* 3. Center-Right Tactical Emerald Ambient Spotlight */}
      <div 
        className="absolute top-[15%] right-[10%] w-[700px] h-[550px] rounded-full blur-[160px] opacity-15"
        style={{ backgroundColor: '#10B981' }}
      />

      {/* 4. Fine Matrix Dot Accents */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#A3E635 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
