import React from "react";
import { BOT_NAME, BOT_PHOTO } from "./torcida-bot";

/**
 * Formata o timestamp para exibição de hora (pt-BR)
 * @param {object|number} ts - Timestamp Firestore ou epoch
 * @returns {string}
 */
function formatTime(ts) {
  // Verifica se o timestamp é válido
  if (!ts) return "";
  // Cria uma data a partir do timestamp
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date();
  // Retorna a hora formatada
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Componente de mensagem individual no chat
 * @param {{m: object, isOwn: boolean, topFan?: boolean}} props
 * - m: objeto da mensagem
 * - isOwn: se a mensagem é do usuário logado
 * - topFan: nome do fã top (opcional)
 */
export default function Message({ m, isOwn, topFan }) {
  // Determina se o usuário é o top fã
  const isTopFan = topFan && m.user === topFan;
  // Determina se a mensagem é do bot
  const isBot = m.user === BOT_NAME || m.uid === 'furia-bot';
  return (
    <div
      className={
        'furia-msg' +
        (isOwn ? ' own-msg' : '') +
        (isTopFan ? ' topfan-msg' : '') +
        (isBot ? ' bot-msg' : '')
      }
      style={{
        // Estilo do container da mensagem
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        marginBottom: 10,
        gap: 7,
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        animation: isBot ? 'bot-pop 0.4s' : undefined
      }}
      aria-label={isBot ? 'Mensagem do bot Torcida FURIA' : undefined}
      role={isBot ? 'status' : undefined}
    >
      {/* Avatar do bot (se aplicável) */}
      {isBot && (
        <img src={BOT_PHOTO} alt="Avatar do Bot" style={{ width: 38, height: 38, borderRadius: '50%', marginRight: 12, marginLeft: isOwn ? 12 : 20, border: '2.5px solid #FFD600', background: '#fff', boxShadow: '0 1px 6px #FFD60033', objectFit: 'cover', display: 'block', alignSelf: 'center' }} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', width: '100%', marginRight: 10, marginLeft: 10,}}>
        {/* Linha com nome, medalha e badge acima do balão */}
        <span style={{display:'flex',alignItems:'center',gap:7,minHeight:2,marginBottom:10}}>
          {/* Medalha de top fã */}
          {isTopFan && <span style={{fontSize:'1.13em',marginRight:2,filter:'drop-shadow(0 1px 5px #FFD60099)'}}>🥇</span>}
          {/* Nome do usuário */}
          <span style={{fontWeight:600, color:isTopFan ? '#FFD600' : '#fff', letterSpacing:0.15}}>{m.user}</span>
          {/* Badge de mensagem, se houver */}
          {m.badge && <span style={{marginLeft:2,filter:'drop-shadow(0 1px 4px #FFD60066)'}}>{m.badge}</span>}
        </span>
        {/* Balão da mensagem */}
        <div style={{
          // Estilo do balão da mensagem
          background: isOwn ? '#FFD600' : '#23242b',
          color: isOwn ? '#181A20' : '#fff',
          borderRadius: isOwn ? '16px 16px 8px 16px' : '16px 16px 16px 8px',
          boxShadow: isOwn ? '0 2px 16px #FFD60044' : '0 1px 8px #0003',
          padding: '10px 18px 9px 18px',
          fontSize: '1.01em',
          fontWeight: 500,
          minWidth: 60,
          minHeight: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: 3,
          maxWidth: '72%'
        }}>
          {/* Texto da mensagem */}
          <span style={{flex:1,wordBreak:'break-word'}}>{m.text}</span>
          {/* Horário da mensagem */}
          <span style={{
            fontSize: isBot && window.location.hash === '#bot-ajuda' ? '1.13em' : '1.07em',
            fontWeight:700,
            color: isBot && window.location.hash === '#bot-ajuda' ? '#FFD600' : (isOwn?'#181A20':'#FFD600'),
            marginLeft:12,
            alignSelf:'flex-end',
            textShadow: isBot && window.location.hash === '#bot-ajuda' ? '0 1px 8px #FFD60077' : (isOwn ? '0 1px 4px #FFD60077' : '0 1px 4px #0008')
          }}>{formatTime(m.ts)}</span>
        </div>
      </div>
    </div>
  );
}

