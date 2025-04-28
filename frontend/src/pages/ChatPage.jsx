import React, { useRef, useEffect } from 'react';
import Message from '../Message';
import styles from './ChatPage.module.css';
import ChannelSelector, { CHANNELS } from '../ChannelSelector.jsx';

/**
 * Página de Chat Principal
 * Exibe as mensagens do canal selecionado, permite envio de mensagens,
 * mostra o usuário logado e regras do chat.
 *
 * Props:
 * - messages: array de mensagens do canal
 * - user: usuário logado
 * - msg: mensagem digitada
 * - setMsg: setter para mensagem
 * - handleSend: função para enviar mensagem
 * - topFan: destaque para fã top (opcional)
 * - channel: canal selecionado
 * - setChannel: setter para canal
 */
export default function ChatPage({ messages, user, msg, setMsg, handleSend, topFan, channel, setChannel }) {
  // Número de participantes online (mock)
  const onlineCount = 12;
  // Avatar e nome do usuário logado
  const avatar = user?.photoURL || '/furia-logo.png';
  const displayName = user?.displayName || 'Fã Anônimo';
  // Ref para scroll automático ao fim das mensagens
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <section className={styles.chatContainer}>
      {/* Header fixo: logo, título e subtítulo do canal */}
      <header className={styles.chatHeader}>
        <div className={styles.headerMain}>
          <img src="/furia-logo.png" alt="FURIA" className={styles.furiaIcon} />
          <div className={styles.headerTitles}>
            <h2 className={styles.title}>
              {CHANNELS.find(c => c.id === channel)?.label || '#geral'}
              <span className={styles.onlineCount}><b>{onlineCount}</b> online</span>
            </h2>
            <span className={styles.subtitle}>{getChannelDesc(channel)}</span>
          </div>
        </div>
      </header>

      {/* Seletor de canais */}
      <nav className={styles.channelSelectorWrap}>
        <ChannelSelector channel={channel} setChannel={setChannel} />
      </nav>

      {/* Área de mensagens */}
      <div className={styles.messagesArea}>
        {/* Mensagem caso não haja mensagens no canal */}
        {messages.length === 0 && (
          <div className={styles.noMessages}>Nenhuma mensagem ainda. Seja o primeiro a mandar um alô!</div>
        )}
        {/* Renderiza mensagens do canal */}
        {messages.map((m, i) => (
          <Message key={i} m={m} isOwn={user && m.uid === user.uid} topFan={topFan} />
        ))}
        {/* Ref para scroll automático */}
        <div ref={messagesEndRef} />
      </div>

      {/* Barra do usuário e regras do chat */}
      <div className={styles.userInputArea}>
        <div className={styles.userBar}>
          <img src={avatar} alt="Avatar" className={styles.avatar} />
          <span className={styles.userName}>{displayName}</span>
        </div>
        <div className={styles.tipsBox}>
          <span>💡 Dica: Seja respeitoso e divirta-se! <b>Proibido spam e ofensas.</b></span>
        </div>
        {/* Formulário de envio de mensagem */}
        <form className={styles.inputBar} onSubmit={handleSend} autoComplete="off">
          <input
            type="text"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Digite sua mensagem..."
            className={styles.input}
            maxLength={300}
            autoFocus
          />
          <button type="submit" className={styles.sendButton}>Enviar</button>
        </form>
      </div>
    </section>
  );
}

/**
 * Retorna a descrição do canal selecionado
 * @param {string} channel
 * @returns {string}
 */
function getChannelDesc(channel) {
  switch (channel) {
    case 'geral':
      return 'Converse com toda a torcida FURIA!';
    case 'jogo-ao-vivo':
      return 'Comente o jogo AO VIVO com outros fãs.';
    case 'bot-ajuda':
      return 'Canal de suporte: tire dúvidas com o Bot!';
    default:
      return 'Bem-vindo ao chat!';
  }
}

