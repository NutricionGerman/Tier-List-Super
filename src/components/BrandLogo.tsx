import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showText = true,
  lightMode = false
}) => {
  const textColor = lightMode ? 'text-white' : 'text-editorial-text';
  const subColor = lightMode ? 'text-slate-300' : 'text-editorial-muted';
  const iconColor = lightMode ? '#ffffff' : '#2D2A26';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* SVG Icon Logo */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 transition-transform duration-300 hover:scale-105"
      >
        {/* Leaf Outline on Left */}
        <path
          d="M60 15C50 15 35 30 35 55C35 75 48 90 60 98C48 90 42 75 42 55C42 35 52 22 60 17"
          stroke={iconColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 15C52 28 47 48 49 68C51 84 57 93 60 98C54 84 54 62 58 45C60 35 60 22 60 15Z"
          fill={iconColor}
          fillOpacity="0.08"
        />

        {/* DNA Helix Inside Leaf */}
        <g stroke={iconColor} strokeWidth="2.5" strokeLinecap="round">
          {/* Left Strand */}
          <path d="M46 40C48 44 51 48 53 52" />
          <path d="M53 52C55 56 56 60 55 64" />
          <path d="M55 64C54 68 51 72 48 76" />
          {/* Right Strand */}
          <path d="M54 38C52 42 49 46 47 50" strokeWidth="2" opacity="0.6" />
          <path d="M47 50C45 54 44 58 45 62" strokeWidth="2" opacity="0.6" />
          <path d="M45 62C46 66 49 70 52 74" strokeWidth="2" opacity="0.6" />

          {/* Rungs of DNA */}
          <line x1="47.5" y1="42" x2="52.5" y2="42" strokeWidth="2" />
          <line x1="49" y1="52" x2="51.5" y2="52" strokeWidth="2" />
          <line x1="53" y1="62" x2="47" y2="62" strokeWidth="2" />
          <line x1="51" y1="70" x2="46.5" y2="70" strokeWidth="2" />
        </g>

        {/* Running Athlete Figure on Right */}
        <g fill={iconColor}>
          {/* Head */}
          <circle cx="81" cy="34" r="5" />
          {/* Torso & Front Arm */}
          <path
            d="M61 55C66 48 74 44 80 43C83 42.5 86 44 87 46C88.5 48 85 53 82 55"
            stroke={iconColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Back Arm / Swing */}
          <path
            d="M80 43C83 45 86 48 89 44C90.5 42 88.5 39 86 39"
            stroke={iconColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Rear Leg Curve */}
          <path
            d="M59 87C64 82 72 73 73 66C74 58 75 51 81 44"
            stroke={iconColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Forward Leaping Leg */}
          <path
            d="M73 66C77 62 81 61 83 63C85.5 65.5 80 75 73 79"
            stroke={iconColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Supporting Swoosh representing Motion/Speed */}
        <path
          d="M44 95C55 88 66 74 74 62"
          stroke={iconColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M48 99C62 92 78 78 84 66"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {showText && (
        <div className="mt-2 select-none">
          <h1 className={`font-display text-xl font-bold tracking-[0.18em] ${textColor}`}>
            GERMÁN AUAD
          </h1>
          <p className={`font-sans text-[8.5px] font-semibold tracking-[0.25em] uppercase mt-1 ${subColor}`}>
            Ciencia <span className="mx-1">|</span> Nutrición <span className="mx-1">|</span> Movimiento
          </p>
        </div>
      )}
    </div>
  );
};
