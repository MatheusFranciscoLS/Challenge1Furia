import React from "react";
import styles from "./AgendaPage.module.css";

// Mock de jogos para exibição na agenda
const jogosMock = [
  {
    id: 1,
    data: "29/04/2025",
    hora: "19:00",
    modalidade: "Counter-Strike 2",
    local: "Online",
    adversario: "Imperial",
    adversarioLogo: "/logos/imperial.png",
    status: "scheduled",
  },
  {
    id: 2,
    data: "28/04/2025",
    hora: "21:00",
    modalidade: "VALORANT",
    local: "Arena FURIA",
    adversario: "LOUD",
    adversarioLogo: "/logos/loud.png",
    status: "live",
  },
  {
    id: 3,
    data: "26/04/2025",
    hora: "17:00",
    modalidade: "Counter-Strike 2",
    local: "Online",
    adversario: "paiN Gaming",
    adversarioLogo: "/logos/pain.png",
    status: "finished",
  },
];

/**
 * Página de Agenda de Jogos
 * Exibe uma lista de jogos com data, hora, modalidade, local e adversário.
 * Usa um mock local para exibição dos dados.
 */
export default function AgendaPage() {
  /**
   * Retorna o rótulo do status do jogo (ao vivo, agendado, encerrado)
   * @param {string} status
   * @returns {string}
   */
  function statusLabel(status) {
    if (status === "live") return "AO VIVO";
    if (status === "scheduled") return "AGENDADO";
    if (status === "finished") return "ENCERRADO";
    return "";
  }

  return (
    <section className={styles.agendaContainer}>
      {/* Título da agenda */}
      <h2 className={styles.agendaTitle}>Agenda de Jogos</h2>
      <div className={styles.agendaBoard}>
        {/* Mensagem caso não haja jogos */}
        {jogosMock.length === 0 && (
          <div className={styles.agendaEmpty}>Nenhum jogo agendado.</div>
        )}
        {/* Renderiza cada jogo da agenda */}
        {jogosMock.map((jogo) => (
          <div key={jogo.id} className={styles.jogoCard}>
            <div className={styles.placarInfo}>
              <div className={styles.placarData}>
                {jogo.data} <span style={{ color: "#FFD600", fontWeight: 700 }}>{jogo.hora}</span>
              </div>
              <div className={styles.placarModalidade}>{jogo.modalidade}</div>
              <div style={{ color: "#FFD600", fontWeight: 700, fontSize: "0.98em" }}>{jogo.local}</div>
            </div>
            <div className={styles.placarTeams}>
              <span className={styles.placarTeam}><img src="/furia-logo.png" alt="FURIA" className={styles.placarLogo} />FURIA</span>
              <span className={styles.placarVersus}>vs</span>
              <span className={styles.placarTeam}><img src={jogo.adversarioLogo} alt={jogo.adversario} className={styles.placarLogo} />{jogo.adversario}</span>
            </div>
            <div className={styles.placarResult}>
              <span className={
                styles.placarStatus + ' ' +
                (jogo.status === 'live' ? styles.placarVit : jogo.status === 'scheduled' ? styles.placarEmp : styles.placarDer)
              }>{statusLabel(jogo.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
