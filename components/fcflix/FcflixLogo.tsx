type FcflixLogoProps = {
  className?: string;
};

export function FcflixLogo({ className = "" }: FcflixLogoProps) {
  return (
    <svg
      viewBox="0 0 140 44"
      className={`h-8 w-[6.25rem] shrink-0 sm:h-10 sm:w-[7.75rem] ${className}`}
      aria-label="Fcflix"
      role="img"
    >
      <defs>
        <path id="fcflix-arc" d="M 2 32 Q 70 26 138 32" fill="none" />
      </defs>
      <text
        fill="#E50914"
        fontSize="27"
        fontWeight="900"
        fontFamily="Arial Black, Impact, Haettenschweiler, sans-serif"
        letterSpacing="0.5"
      >
        <textPath href="#fcflix-arc" startOffset="50%" textAnchor="middle">
          FCFLIX
        </textPath>
      </text>
    </svg>
  );
}
