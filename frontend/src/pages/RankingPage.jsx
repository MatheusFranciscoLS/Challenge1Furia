import React from 'react';
import styles from './RankingPage.module.css';

/**
 * Página de Ranking dos Fãs
 * Agrupa mensagens por UID (usuário autenticado), ignora bots e nomes padrão,
 * e exibe o nome mais atualizado do usuário. Mostra o ranking dos fãs mais ativos.
 *
 * Props:
 * - messages: Array de mensagens (opcional)
 * - allMessages: Array de todas as mensagens (opcional, prioridade se existir)
 */
export default function RankingPage({ messages = [], allMessages }) {
  // Usa allMessages se disponível, senão messages
  const msgs = allMessages && allMessages.length ? allMessages : messages;

  // fanMap: objeto para agrupar mensagens por UID
  // Exclui bots e nomes padrão
  const fanMap = {};
  msgs.forEach(m => {
    // Ignora mensagens sem UID (anônimos ou dados incompletos)
    if (!m.uid) return;
    // Ignora mensagens do bot, da "Torcida FURIA" e do canal bot-ajuda
    if (m.uid === 'furia-bot' || (m.user && m.user.trim().toLowerCase() === 'torcida furia')) return;
    if (m.channel === 'bot-ajuda') return;
    // Inicializa contagem se não existir
    if (!fanMap[m.uid]) {
      fanMap[m.uid] = { count: 0, lastMsg: m };
    }
    // Incrementa contagem
    fanMap[m.uid].count++;
    // Atualiza o último dado (para exibir nome atualizado)
    if (!fanMap[m.uid].lastMsg.ts || (m.ts && m.ts > fanMap[m.uid].lastMsg.ts)) {
      fanMap[m.uid].lastMsg = m;
    }
  });

  // Monta array de ranking, ordenado pelo número de mensagens (decrescente)
  const ranking = Object.entries(fanMap)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([, { count, lastMsg }]) => ({
      nome: lastMsg.displayName || lastMsg.user || lastMsg.email || 'Anônimo',
      pontos: count
    }));

  return (
    <section className={styles.rankingContainer}>
      {/* Título e descrição do ranking */}
      <h2 className={styles.rankingTitle}>Ranking dos Fãs</h2>
      <p className={styles.rankingDesc}>Veja quem são os fãs mais ativos, engajados e participativos da FURIA GG!</p>
      <div className={styles.rankingList}>
        {/* Mensagem caso não haja fãs ativos */}
        {ranking.length === 0 && (
          <div style={{ color: '#FFD600', textAlign: 'center', fontWeight: 700, padding: 30 }}>
            Nenhum fã ativo encontrado ainda.
          </div>
        )}
        {/* Renderiza cada fã do ranking */}
        {ranking.map((fan, idx) => (
          <div
            key={fan.nome + idx}
            className={
              styles.rankingFan +
              (idx === 0
                ? ' ' + styles.rankingFanTop1
                : idx === 1
                ? ' ' + styles.rankingFanTop2
                : idx === 2
                ? ' ' + styles.rankingFanTop3
                : '')
            }
          >
            <span className={styles.rankingFanPos}>{idx + 1}º</span>
            <span className={styles.rankingFanName}>{fan.nome}</span>
            <span className={styles.rankingFanScore}>{fan.pontos} msg</span>
          </div>
        ))}
      </div>
    </section>
  );
}
