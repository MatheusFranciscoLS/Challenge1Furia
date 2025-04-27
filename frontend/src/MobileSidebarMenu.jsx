import React, { useState } from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";

export default function MobileSidebarMenu({ channel, setChannel, topFans, user, open, onClose }) {
  if (!open) return null;
  return (
    <div className="furia-mobile-menu-overlay" onClick={onClose}>
      <aside className="furia-mobile-sidebar" onClick={e => e.stopPropagation()}>
        <button className="furia-mobile-menu-close" onClick={onClose} aria-label="Fechar menu">×</button>
        <h2>Canais</h2>
        <div className="furia-sidebar-channels">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              className={
                "furia-channel-btn" + (channel === c.id ? " active" : "")
              }
              onClick={() => { setChannel(c.id); onClose(); }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="furia-mobile-section">
          <div className="furia-sidebar-label">Top Fãs</div>
          <ol className="furia-topfans-list">
            {topFans.map(({ user, count, uid }, idx) => {
              const medals = ['🥇','🥈','🥉','🎖️','🏅'];
              const medal = medals[idx] || '';
              return (
                <li key={uid} className={idx === 0 ? "top-fan-highlight" : ""} style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:'1.25em',marginRight:2}}>{medal}</span>
                  <span style={{fontWeight:500}}>{user}</span>
                  <Badges count={count} />
                  <span className="topfans-count">({count})</span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="furia-mobile-section">
          <div className="furia-sidebar-label">Mural de Recados</div>
          <MuralRecados user={user} topFanUid={topFans && topFans[0] ? topFans[0].uid : null} topFansArr={topFans} />
        </div>
      </aside>
    </div>
  );
}
