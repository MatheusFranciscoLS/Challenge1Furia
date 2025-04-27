import React, { useState } from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";
import JogosAgendaModal from "./JogosAgendaModal";
import PlacaresModal from "./PlacaresModal";

export default function Sidebar({ channel, setChannel, topFans, user }) {
  const [openJogos, setOpenJogos] = useState(false);
  const [openPlacares, setOpenPlacares] = useState(false);
  return (
    <aside className="furia-sidebar">
      <div className="furia-sidebar-section">
        <h2>Canais</h2>
        <div className="furia-sidebar-channels">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              className={
                "furia-channel-btn" + (channel === c.id ? " active" : "")
              }
              onClick={() => setChannel(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          className="furia-jogos-btn"
          style={{marginTop:14,background:'#FFD600',color:'#222',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',width:'100%'}}
          onClick={() => setOpenJogos(true)}
        >
          🏆 Agenda de Jogos
        </button>
        <button
          className="furia-placares-btn"
          style={{marginTop:8,background:'#FFD600',color:'#222',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',width:'100%'}}
          onClick={() => setOpenPlacares(true)}
        >
          📊 Placares Recentes
        </button>
        <JogosAgendaModal open={openJogos} onClose={() => setOpenJogos(false)} />
        <PlacaresModal open={openPlacares} onClose={() => setOpenPlacares(false)} />
      </div>

      {channel !== 'bot-ajuda' && (
        <div className="furia-sidebar-section">
          <div className="furia-sidebar-label" style={{display:'flex',alignItems:'center',gap:7,marginBottom:8,fontWeight:800,fontSize:'1.13em',color:'#FFD600',textShadow:'0 1px 5px #FFD60033',letterSpacing:0.2}}>
            <span style={{fontSize:'1.2em',marginTop:1}}>⭐</span>
            Top Fãs
          </div>
          <ol className="furia-topfans-list" style={{paddingLeft:0,marginBottom:6}}>
            {topFans.slice(0, 3).map(({ user, count, uid, photo, xp }, idx) => {
              const medals = ['🥇','🥈','🥉','🎖️','🏅'];
              const medal = medals[idx] || '';
              const isTop1 = idx === 0;
              return (
                <li
                  key={uid}
                  className={isTop1 ? "top-fan-highlight" : ""}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    background: isTop1 ? 'linear-gradient(90deg,#FFD60033 60%,#181A20 100%)' : '#23242b',
                    borderRadius: 12,
                    padding: isTop1 ? '5px 10px' : '4px 8px',
                    marginBottom: 3,
                    boxShadow: isTop1 ? '0 1px 7px #FFD60055' : '0 1px 2px #0003',
                    border: isTop1 ? '1.5px solid #FFD600' : '1px solid #FFD60022',
                    minHeight: 32,
                    fontSize: isTop1 ? '1em' : '0.96em',
                    animation: 'fadeInTopFan 0.7s cubic-bezier(.62,-0.01,.47,1.01)'
                  }}
                  title={`Top ${idx+1} - ${user} (${count} mensagens)`}
                >
                  <span style={{fontSize:isTop1?'1.5em':'1.18em',marginRight:2,filter:isTop1?'drop-shadow(0 1px 4px #FFD60088)':'none'}}>{medal}</span>
                  {photo && <img src={photo} alt={user} style={{width:isTop1?26:22,height:isTop1?26:22,borderRadius:'50%',border:'1.5px solid #FFD60033',objectFit:'cover',marginRight:2,background:'#111'}} />}
                  <span style={{fontWeight:700,fontSize:isTop1?'1.01em':'0.97em',color:isTop1?'#FFD600':'#fff',letterSpacing:0.1}}>{user}</span>
                  <Badges count={count} />
                  {xp && <span style={{color:'#FFD600',fontSize:'0.89em',marginLeft:4}} title="XP">{xp} XP</span>}
                  <span className="topfans-count" style={{marginLeft:4,fontSize:'0.96em'}}>({count})</span>
                </li>
              );
            })}
          </ol>
          <style>{`
          @keyframes fadeInTopFan {
            from { opacity: 0; transform: translateY(-12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          `}</style>
        </div>
      )}
      <div className="furia-sidebar-section">
        <div className="furia-sidebar-label" style={{display:'flex',alignItems:'center',gap:7,marginBottom:8,fontWeight:800,fontSize:'1.13em',color:'#FFD600',textShadow:'0 1px 5px #FFD60033',letterSpacing:0.2}}>
          <span style={{fontSize:'1.19em',marginTop:1}}>💬</span>
          Mural de Recados
        </div>
        <MuralRecados user={user} topFanUid={topFans && topFans[0] ? topFans[0].uid : null} topFansArr={topFans} />
      </div>


    </aside>
  );
}
