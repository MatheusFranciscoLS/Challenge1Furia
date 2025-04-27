import React, { useEffect, useState } from "react";

/**
 * Exibe o status ao vivo de uma partida
 * @param {{status: object}} props
 */

export default function LiveStatus({ status }) {
  const [nextGame, setNextGame] = useState(null);

  // Busca o próximo jogo se não houver status ao vivo
  useEffect(() => {
    if (status && typeof status === 'object' && Object.keys(status).length > 0) return;
    fetch('/jogos.json')
      .then(res => res.json())
      .then(data => {
        if (!data || !Array.isArray(data.jogos)) return;
        // Pega a data/hora mais próxima do futuro
        const now = new Date();
        const jogosFuturos = data.jogos
          .map(j => ({
            ...j,
            dateObj: parseDate(j.data, j.hora)
          }))
          .filter(j => j.dateObj && j.dateObj > now)
          .sort((a, b) => a.dateObj - b.dateObj);
        setNextGame(jogosFuturos[0] || null);
      })
      .catch(() => setNextGame(null));
  }, [status]);

  function parseDate(data, hora) {
    // data: "dd/MM/yyyy", hora: "HH:mm"
    if (!data || !hora) return null;
    const [d, m, y] = data.split('/').map(Number);
    const [h, min] = hora.split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  }

  // Se não houver status válido, mostra box de próxima partida
  if (!status || typeof status !== 'object' || Object.keys(status).length === 0) {
    return (
      <section
        style={{
          background: "#181818",
          color: "#fff",
          padding: "1.5em",
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: "0 2px 12px #0002",
          borderLeft: `6px solid #444` ,
          maxWidth: 400,
          opacity: 0.85
        }}
        aria-live="polite"
      >
        <h3 style={{ margin: 0, marginBottom: 8, fontSize: "1.3em" }}>
          Próxima partida
        </h3>
        {nextGame ? (
          <div style={{ color: '#FFD600', fontSize: '1.08em', marginBottom: 6 }}>
            <strong>{nextGame.modalidade}</strong> vs <strong>{nextGame.adversario}</strong><br />
            <span style={{ color: '#fff' }}>{nextGame.data} às {nextGame.hora}</span><br />
            <span style={{ color: '#bbb', fontSize: '0.97em' }}>{nextGame.torneio}</span>
          </div>
        ) : (
          <div style={{ color: '#bbb', fontSize: '1em' }}>
            Nenhuma partida ao vivo no momento.<br />Fique ligado para a próxima transmissão!
          </div>
        )}
      </section>
    );
  }

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


