import React from "react";

/**
 * Exibe o status ao vivo de uma partida
 * @param {{status: object}} props
 */
export default function LiveStatus({ status }) {
  if (!status || typeof status !== 'object') return null;

  // Cores para diferentes status
  const statusColors = {
    "Ao Vivo": "#2ecc40",
    "Finalizado": "#ff4136",
    "Pausado": "#ffdc00",
    "Aguardando": "#0074d9",
    "default": "#888"
  };

  const color = statusColors[status.status] || statusColors.default;

  return (
    <section
      style={{
        background: "#181818",
        color: "#fff",
        padding: "1.5em",
        borderRadius: 12,
        marginBottom: 20,
        boxShadow: "0 2px 12px #0002",
        borderLeft: `6px solid ${color}`,
        maxWidth: 400
      }}
      aria-live="polite"
    >
      <h3 style={{ margin: 0, marginBottom: 8, fontSize: "1.3em" }}>
        {status.match || "Partida ao vivo"}
      </h3>
      {status.status && (
        <div style={{ marginBottom: 8 }}>
          <strong>Status:</strong>{" "}
          <span style={{ color, fontWeight: "bold" }}>
            {status.status}
          </span>
        </div>
      )}
      {status.score && (
        <div>
          <strong>Placar:</strong> {status.score}
        </div>
      )}
      {status.round && (
        <div>
          <strong>Round:</strong> {status.round}
        </div>
      )}
      {status.map && (
        <div>
          <strong>Mapa:</strong> {status.map}
        </div>
      )}
    </section>
  );
}

