import React, { useState } from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";
import JogosAgendaModal from "./JogosAgendaModal";
import PlacaresModal from "./PlacaresModal";
import SidebarQuizEnqueteButtons from "./SidebarQuizEnqueteButtons";

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
        {/* Botões Quiz/Enquete */}
        <SidebarQuizEnqueteButtons onQuiz={typeof onQuiz === 'function' ? onQuiz : undefined} onEnquete={typeof onEnquete === 'function' ? onEnquete : undefined} />
      </div>

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
