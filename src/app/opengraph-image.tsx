import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { LOCATION } from "@/lib/contact";
import { SITE_NAME } from "@/lib/site";

// Vista previa al compartir el link (WhatsApp, LinkedIn, X, etc.)
export const alt = `${SITE_NAME} · Diseño y desarrollo web a medida`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/logo.png"),
  "base64",
);
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "radial-gradient(ellipse at 85% 15%, #3a0712 0%, #000000 60%)",
        color: "#f6eee6",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image */}
      <img src={logoSrc} height={116} width={103} alt="" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            maxWidth: 900,
          }}
        >
          Diseño y desarrollo web a medida.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "rgba(246, 238, 230, 0.6)",
          }}
        >
          {`${SITE_NAME} · ${LOCATION.label}`}
        </div>
      </div>
    </div>,
    size,
  );
}
