import React from 'react';
import styles from './MuralPage.module.css';

// Mock de recados oficiais para exibição
const recadosMock = [
  {
    id: 1,
    user: 'Staff FURIA',
    photo: '/furia-logo.png',
    text: 'Bem-vindos ao mural oficial! Fiquem ligados para novidades e eventos exclusivos.',
    ts: '27/04/2025'
  },
  {
    id: 2,
    user: 'Equipe Social Media',
    photo: '/furia-logo.png',
    text: 'Promoção especial para os fãs: participe do quiz e concorra a brindes!',
    ts: '25/04/2025'
  }
];

/**
 * Página do Mural de Recados
 * Exibe recados oficiais da equipe FURIA para os fãs.
 * Usa um mock local para exibição dos dados.
 */
export default function MuralPage() {
  return (
    <section className={styles.muralContainer}>
      {/* Título e descrição do mural */}
      <h2 className={styles.muralTitle}>Mural de Recados</h2>
      <p style={{
        color: '#23242b',
        background: '#FFD60022',
        borderRadius: '10px',
        padding: '14px 22px',
        fontWeight: 500,
        fontSize: '1.12em',
        textAlign: 'center',
        marginBottom: 22,
        maxWidth: 480,
        margin: '0 auto 22px auto'
      }}>
        Aqui você acompanha os recados oficiais da FURIA. Fique ligado para novidades, campanhas e mensagens da staff!
      </p>
      {/* Lista de recados */}
      <div className={styles.muralBoard}>
        {/* Mensagem caso não haja recados */}
        {recadosMock.length === 0 && (
          <div className={styles.muralEmpty}>Nenhum recado oficial publicado ainda.</div>
        )}
        {/* Renderiza cada recado */}
        {recadosMock.map(r => (
          <div key={r.id} className={styles.recadoItem}>
            <img src={r.photo} alt={r.user} className={styles.recadoAvatar} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.recadoUser}>{r.user}</div>
              <div style={{
                background:'#FFD60011',
                borderRadius:10,
                color:'#23242b',
                fontSize:'1.09em',
                marginBottom:4,
                boxShadow:'0 1px 8px #FFD60011',
                padding:'11px 16px 8px 16px',
                position:'relative',
                minHeight:28
              }}>
                <span style={{display:'block',textAlign:'left',marginBottom:0,wordBreak:'break-word',whiteSpace:'pre-wrap',overflowWrap:'break-word',lineHeight: 1.28}}>{r.text}</span>
              </div>
              <span className={styles.recadoDate}>{r.ts}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
