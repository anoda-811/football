type FcflixAppIconProps = {
  className?: string;
};

export function FcflixAppIcon({ className = "" }: FcflixAppIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`h-[68%] w-[68%] ${className}`}
      aria-hidden
    >
      <text
        x="32"
        y="47"
        textAnchor="middle"
        fill="#E50914"
        fontSize="50"
        fontWeight="900"
        fontFamily="Arial Black, Impact, Haettenschweiler, sans-serif"
        letterSpacing="-1"
      >
        F
      </text>
    </svg>
  );
}
