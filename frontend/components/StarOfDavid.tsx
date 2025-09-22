// frontend/components/StarOfDavid.tsx
import React from "react";

type Props = {
  size?: number | string;
  className?: string;
  title?: string;
};

const StarOfDavid: React.FC<Props> = ({ size = 64, className = "", title = "Magen David" }) => {
  // SVG: dois triângulos sobrepostos + glow (radialGradient + blur)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="1" />
          <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Glow suave por trás */}
      <circle cx="50" cy="50" r="42" fill="url(#starGlow)" filter="url(#softBlur)" />

      {/* Triângulo para cima */}
      <polygon
        points="50,12 73,52 27,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Triângulo para baixo */}
      <polygon
        points="50,88 27,48 73,48"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StarOfDavid;

