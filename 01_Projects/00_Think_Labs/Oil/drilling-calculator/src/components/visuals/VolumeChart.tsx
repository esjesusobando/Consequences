import React from "react";

interface VolumeChartProps {
  drillStringVol: number;
  annularVol: number;
  surfaceVol?: number;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
  drillStringVol,
  annularVol,
  surfaceVol = 0,
}) => {
  const total = drillStringVol + annularVol + surfaceVol || 1;
  const pString = (drillStringVol / total) * 100;
  const pAnnular = (annularVol / total) * 100;

  return (
    <div
      className="trivi-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          color: "var(--sh-grey-500)",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}
      >
        Distribución de Volumen
      </h4>

      <div
        style={{
          position: "relative",
          width: "140px",
          height: "140px",
          margin: "0 auto",
        }}
      >
        <svg viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <filter id="innerShadow">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="0.5" />
              <feOffset dx="0" dy="0.5" result="offsetblur" />
              <feFlood floodColor="black" floodOpacity="0.1" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="transparent"
            stroke="var(--sh-grey-50)"
            strokeWidth="8.5"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="transparent"
            stroke="var(--sh-lima)"
            strokeWidth="8"
            strokeDasharray={`${(pString * 113.1) / 100} ${113.1}`}
            strokeLinecap="round"
            filter="url(#innerShadow)"
          />
          {/* Separator - Silicon Valley Detail */}
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="transparent"
            stroke="#ffffff"
            strokeWidth="8.5"
            strokeDasharray={`0.6 112.5`}
            strokeDashoffset={-(pString * 113.1) / 100}
            strokeLinecap="butt"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="transparent"
            stroke="var(--sh-azul)"
            strokeWidth="8"
            strokeDasharray={`${(pAnnular * 113.1) / 100} ${113.1}`}
            strokeDashoffset={-((pString + 0.5) * 113.1) / 100}
            strokeLinecap="round"
            filter="url(#innerShadow)"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            background: "white",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: 900,
              fontFamily: "var(--font-mono)",
              color: "var(--sh-grey-900)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {total.toFixed(0)}
          </div>
          <div
            style={{
              fontSize: "9px",
              color: "var(--sh-grey-400)",
              textTransform: "uppercase",
              fontWeight: 800,
              letterSpacing: "0.15em",
              marginTop: "4px",
            }}
          >
            BBL <br /> TOTALES
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--sh-lima-text)" /* High Contrast Legible Lima */,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "2px",
              background: "var(--sh-lima)",
            }}
          />
          Sarta
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--sh-azul)" /* Legend Color Match */,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "2px",
              background: "var(--sh-azul)",
            }}
          />
          Anular
        </div>
      </div>
    </div>
  );
};
