type Props = {
  className?: string;
};

/**
 * Le Tap — the Palgonic brand mark.
 * A solid dot with two arcs radiating outward — the NFC tap gesture,
 * the moment of connection.
 *
 * Uses `currentColor` so it adapts to whatever text color is in scope.
 * Render at any size via `className` (h-4 w-4, h-12 w-12, h-32 w-32, etc).
 */
export function LeTapMark({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Outer arc — wider radio wave */}
      <path
        d="M3.5 11 A 9 9 0 0 1 20.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Inner arc — closer wave */}
      <path
        d="M7.5 13 A 5 5 0 0 1 16.5 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* The tap dot */}
      <circle cx="12" cy="17.5" r="2.5" fill="currentColor" />
    </svg>
  );
}
