export function SoccerPitch() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 150 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <rect x="0" y="0" width="150" height="100" fill="#f0fdf4" />

      {/* Outer boundary */}
      <rect
        x="2"
        y="2"
        width="146"
        height="96"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />

      {/* Halfway line */}
      <line
        x1="75"
        y1="2"
        x2="75"
        y2="98"
        stroke="#16a34a"
        strokeWidth="0.5"
      />

      {/* Center circle */}
      <circle
        cx="75"
        cy="50"
        r="12"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <circle cx="75" cy="50" r="0.6" fill="#16a34a" />

      {/* Left penalty area */}
      <rect
        x="2"
        y="22"
        width="22"
        height="56"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <rect
        x="2"
        y="34"
        width="8"
        height="32"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <circle cx="16" cy="50" r="0.6" fill="#16a34a" />
      <path
        d="M 24 44 A 6 6 0 0 0 24 56"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />

      {/* Right penalty area */}
      <rect
        x="126"
        y="22"
        width="22"
        height="56"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <rect
        x="140"
        y="34"
        width="8"
        height="32"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <circle cx="134" cy="50" r="0.6" fill="#16a34a" />
      <path
        d="M 126 44 A 6 6 0 0 1 126 56"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />

      {/* Corner arcs */}
      <path
        d="M 4 2 A 2 2 0 0 0 2 4"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <path
        d="M 2 96 A 2 2 0 0 0 4 98"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <path
        d="M 146 2 A 2 2 0 0 1 148 4"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
      <path
        d="M 148 96 A 2 2 0 0 1 146 98"
        fill="none"
        stroke="#16a34a"
        strokeWidth="0.5"
      />
    </svg>
  );
}
