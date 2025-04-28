/**
 * TopFans.jsx
 * Componente de ranking dos fãs mais ativos do chat FURIA.
 * Exibe os usuários com mais mensagens, mostrando medalhas, badges e XP.
 *
 * Props:
 * - messages: Array de objetos de mensagem (cada um com user, displayName, uid, photo, etc)
 *
 * Lógica:
 * - Conta mensagens por usuário (usando uid se disponível, senão nome).
 * - Ignora mensagens do canal de suporte e do bot.
 * - Busca badges e XP do localStorage (sincronizado pelo bot).
 * - Exibe até 3 primeiros com medalhas, avatar, nome, badges, XP e contagem de mensagens.
 *
 * Acessibilidade:
 * - Usa <ol> para ranking ordenado.
 * - Usa alt nos avatares.
 *
 * Possíveis extensões: mostrar top 5, filtrar por canal, customizar medalhas.
 */
import React from "react";

export default function TopFans({ messages }) {
  // Conta mensagens por UID (se disponível) ou nome
  const counts = {};
  const userInfo = {};
  messages.forEach(m => {
    if (m.channel === 'bot-ajuda') return; // Ignora mensagens do canal de suporte
    const nome = (m.user || m.displayName || '').trim().toLowerCase();
    const uid = m.uid || `anon-${(m.user || m.displayName || 'anon')}`;
    if (uid === 'furia-bot' || nome === 'torcida furia') return; // Filtro do bot
    if (!counts[uid]) {
      counts[uid] = 0;
      userInfo[uid] = {
        nome: m.user || m.displayName || 'Anônimo',
        photo: m.photoURL || m.photo || '',
      };
    }
    counts[uid]++;
  });
  const ranking = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="furia-topfans-card" style={{ marginBottom: 16, background: '#181A20', color: '#FFD600' }}>
      <b>Ranking dos Fãs Mais Ativos</b>
      {ranking.length === 0 ? (
        <div style={{ marginTop: 8, color: '#fff' }}>Sem mensagens ainda neste canal.</div>
      ) : (
        <ol className="furia-topfans-list" style={{ margin: '8px 0 0 16px', padding: 0 }}>
          {ranking.slice(0, 3).map(([uid, count], idx) => {
            const { nome, photo } = userInfo[uid] || {};
            // Busca badge e XP do localStorage (sincronizado com bot)
            let badges = '';
            let xp = '';
            try {
              const allBadges = JSON.parse(localStorage.getItem('furiaBadges') || '{}');
              const allXP = JSON.parse(localStorage.getItem('furiaXP') || '{}');
              badges = allBadges[uid] || allBadges[nome] || '';
              xp = allXP[uid] || allXP[nome] || '';
            } catch { /* Ignorar erros de leitura do localStorage */ }
            return (
              <li
                key={uid}
                style={{ fontWeight: idx === 0 ? 'bold' : 'normal', display: 'flex', alignItems: 'center' }}
              >
                {/* Medalha para top 3 */}
                {medals[idx] || ''}
                {/* Avatar do usuário */}
                {photo ? (
                  <img
                    src={photo}
                    alt={nome}
                    style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #FFD60033', objectFit: 'cover', marginRight: 6, background: '#111' }}
                  />
                ) : (
                  <span
                    style={{ width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#222', color: '#FFD600', fontSize: '1em', border: '1.5px solid #FFD60033', marginRight: 6 }}
                  >
                    ?
                  </span>
                )}
                {/* Nome do usuário */}
                <span
                  style={{ marginRight: 5, fontWeight: 700, fontSize: idx === 0 ? '1.06em' : '0.97em', color: idx === 0 ? '#FFD600' : '#fff', letterSpacing: 0.1 }}
                >
                  {nome}
                </span>
                {/* Badges (se houver) */}
                {badges && <span style={{ margin: '0 6px', fontSize: 18 }} title={badges}>{badges}</span>}
                {/* XP (se houver) */}
                {xp && <span style={{ color: '#FFD600', fontSize: 13, marginLeft: 4 }} title="XP">{xp} XP</span>}
                {/* Contador de mensagens */}
                <span style={{ color: '#fff', fontWeight: 'normal', marginLeft: 6 }}>({count} msg)</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

