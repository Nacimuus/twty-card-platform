import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Palgonic — Une carte. Un tap. Une connexion.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF7F2",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top — logo lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="64"
            height="64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 11 A 9 9 0 0 1 20.5 11"
              stroke="#0E5C4D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M7.5 13 A 5 5 0 0 1 16.5 13"
              stroke="#0E5C4D"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17.5" r="2.5" fill="#0E5C4D" />
          </svg>
          <span
            style={{
              fontSize: "52px",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              fontWeight: 500,
            }}
          >
            palgonic
          </span>
        </div>

        {/* Middle — headline + subhead */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "96px",
              color: "#1A1A1A",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Une carte.</span>
            <span>Un tap.</span>
            <span style={{ color: "#0E5C4D" }}>Une connexion.</span>
          </div>
          <div
            style={{
              marginTop: "40px",
              fontSize: "28px",
              color: "#0E5C4D",
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            Carte de visite digitale · NFC + QR · Pour indépendants
            francophones
          </div>
        </div>

        {/* Bottom — URL stamp */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              color: "#8A8580",
              letterSpacing: "0.12em",
            }}
          >
            PALGONIC.COM
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
