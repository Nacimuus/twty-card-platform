/**
 * Palgonic wordmark with integrated "Le Tap" mark replacing the second "o".
 * The dot uses currentColor (defaults to text-foret).
 * The arc above the dot is hardcoded Corail.
 */
export function PalgonicLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display font-medium tracking-tight text-foret ${className}`}
      aria-label="palgonic"
    >
      <span style={{ position: "relative", whiteSpace: "nowrap" }}>
        palg
        <span
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          {/* Invisible "o" — preserves text width and baseline */}
          <span style={{ visibility: "hidden" }} aria-hidden="true">
            o
          </span>
          {/* Dot + arc overlay */}
          <svg
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              width: "0.9em",
              height: "1.05em",
              overflow: "visible",
            }}
            viewBox="0 0 20 22"
            fill="none"
            aria-hidden="true"
          >
            {/* Arc — Corail */}
            <path
              d="M 3 8 Q 10 2 17 8"
              stroke="#E07856"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Dot — currentColor (Forêt) */}
            <circle cx="10" cy="16" r="6" fill="currentColor" />
          </svg>
        </span>
        nic
      </span>
    </span>
  );
}
