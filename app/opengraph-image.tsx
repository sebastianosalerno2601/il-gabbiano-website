import { ImageResponse } from "next/og";

export const alt = "Il Gabbiano SRL - Vigilanza non armata e portierato a Napoli";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#38bdf8",
              marginBottom: 12,
              letterSpacing: 4,
            }}
          >
            SICUREZZA E PROFESSIONALITÀ
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            Il Gabbiano SRL
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#94a3b8",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Vigilanza non armata e portierato a Napoli
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#64748b",
              marginTop: 24,
            }}
          >
            Dal 2007 · Napoli e Campania
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
