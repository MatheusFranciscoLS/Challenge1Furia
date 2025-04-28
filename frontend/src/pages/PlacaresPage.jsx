import React from 'react';
import styles from './PlacaresPage.module.css';

// Mock de placares recentes para exibição
const placaresMock = [
  {
    id: 1,
    data: '27/04/2025',
    hora: '18:00',
    modalidade: 'Counter-Strike 2',
    adversario: 'LOUD',
    adversarioLogo: '/logos/loud.png',
    resultado: 'Vitória',
    placar: '16 x 11',
  },
  {
    id: 2,
    data: '25/04/2025',
    hora: '21:30',
    modalidade: 'VALORANT',
    adversario: 'MIBR',
    adversarioLogo: '/logos/mibr.png',
    resultado: 'Derrota',
    placar: '10 x 13',
  },
  {
    id: 3,
    data: '20/04/2025',
    hora: '20:00',
    modalidade: 'Counter-Strike 2',
    adversario: 'paiN Gaming',
    adversarioLogo: '/logos/pain.png',
    resultado: 'Vitória',
    placar: '16 x 7',
  },
];

/**
 * Página de Placares Recentes
 * Exibe os resultados dos jogos mais recentes da FURIA.
 * Usa um mock local para exibição dos dados.
 */
export default function PlacaresPage() {
  return (
    <section className={styles.placaresContainer}>
      {/* Título da página */}
      <h2 className={styles.placaresTitle}>Placares Recentes</h2>
      {/* Lista de placares */}
      <div className={styles.placaresBoard}>
        {/* Mensagem caso não haja placares */}
        {placaresMock.length === 0 && (
          <div style={{color:'#999',textAlign:'center',fontSize:'1.15em',padding:'32px 0'}}>Nenhum placar registrado ainda.</div>
        )}
        {/* Renderiza cada placar */}
        {placaresMock.map(jogo => (
          <div key={jogo.id} className={styles.placarItem}>
            <div className={styles.placarInfo}>
              {/* Data e hora do jogo */}
              <div className={styles.placarData}>{jogo.data} <span style={{color:'#FFD600',fontWeight:700}}>{jogo.hora}</span></div>
              {/* Modalidade do jogo */}
              <div className={styles.placarModalidade}>{jogo.modalidade}</div>
            </div>
            <div className={styles.placarTeams}>
              <span className={styles.placarTeam}><img src="/furia-logo.png" alt="FURIA" className={styles.placarLogo} />FURIA</span>
              <span className={styles.placarVersus}>vs</span>
              <span className={styles.placarTeam}><img src={jogo.adversarioLogo} alt={jogo.adversario} className={styles.placarLogo} />{jogo.adversario}</span>
            </div>
            <div className={styles.placarResult}>
              <span className={
                styles.placarPlacar + ' ' +
                (jogo.resultado === 'Vitória' ? styles.placarVit : jogo.resultado === 'Derrota' ? styles.placarDer : styles.placarEmp)
              }>{jogo.placar}</span>
              <span className={
                styles.placarStatus + ' ' +
                (jogo.resultado === 'Vitória' ? styles.placarVit : jogo.resultado === 'Derrota' ? styles.placarDer : styles.placarEmp)
              }>{jogo.resultado}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
