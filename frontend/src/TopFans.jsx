import React from "react";

/**
 * Componente de ranking dos fãs mais ativos do chat.
 * Exibe os 5 usuários com mais mensagens, mostrando medalhas, badges e XP.
 *
 * @param {{ messages: Array<{user?: string, displayName?: string}> }} props
 *   - messages: lista de mensagens do chat
 * @returns {JSX.Element} Ranking dos fãs mais ativos
 */
export default function TopFans({ messages }) {
  // Conta mensagens por UID (robusto, separa anônimos)
  const counts = {};
  const userInfo = {};
  messages.forEach(m => {
    const uid = m.uid || `anon-${(m.user || m.displayName || 'anon')}`;
    if (!counts[uid]) {
      counts[uid] = 0;
      userInfo[uid] = {
        nome: m.user || m.displayName || 'Anônimo',
        photo: m.photo || '',
      };
    }
    counts[uid]++;
  });
  const ranking = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  const medals = ['🥇', '🥈', '🥉', '🎖️', '🏅'];

  return (
    <div className="furia-card" style={{marginBottom:16, background:'#181A20', color:'#FFD600'}}>
      <b>Ranking dos Fãs Mais Ativos</b>
      {ranking.length === 0 ? (
        <div style={{marginTop:8, color:'#fff'}}>Sem mensagens ainda neste canal.</div>
      ) : (
        <ol className="furia-topfans-list" style={{margin:'8px 0 0 16px', padding:0}}>
          {ranking.slice(0, 3).map(([uid, count], idx) => {
            const { nome, photo } = userInfo[uid] || {};
            // Busca badge e XP do localStorage (sincronizado com bot)
            let badges = '';
            let xp = '';
            try {
              const allBadges = JSON.parse(localStorage.getItem('furiaBadges')||'{}');
              const allXP = JSON.parse(localStorage.getItem('furiaXP')||'{}');
              badges = allBadges[uid] || allBadges[nome] || '';
              xp = allXP[uid] || allXP[nome] || '';
            } catch {}
            return (
              <li key={uid} style={{fontWeight: idx === 0 ? 'bold' : 'normal', display:'flex', alignItems:'center'}}>
                {medals[idx] || ''}
                {photo ? (
                  <img src={photo} alt={nome} style={{width:22,height:22,borderRadius:'50%',border:'1.5px solid #FFD60033',objectFit:'cover',marginRight:6,background:'#111'}} />
                ) : (
                  <span style={{width:22,height:22,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',background:'#222',color:'#FFD600',fontSize:'1em',border:'1.5px solid #FFD60033',marginRight:6}}>?</span>
                )}
                <span style={{marginRight:5,fontWeight:700,fontSize:idx===0?'1.06em':'0.97em',color:idx===0?'#FFD600':'#fff',letterSpacing:0.1}}>{nome}</span>
                {badges && <span style={{margin:'0 6px', fontSize:18}} title={badges}>{badges}</span>}
                {xp && <span style={{color:'#FFD600', fontSize:13, marginLeft:4}} title="XP">{xp} XP</span>}
                <span style={{color:'#fff',fontWeight:'normal', marginLeft:6}}>({count} msg)</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

