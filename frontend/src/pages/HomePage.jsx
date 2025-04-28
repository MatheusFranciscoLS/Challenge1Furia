// Importação de bibliotecas
import React from 'react';
import { Link } from 'react-router-dom';

// Definição de seções
const sections = [
  {
    to: '/chat',
    icon: '💬',
    title: 'Chat',
    desc: 'Converse ao vivo com outros fãs, comente partidas e participe de interações exclusivas.',
    color: '#FFD600'
  },
  {
    to: '/mural',
    icon: '📝',
    title: 'Mural de Recados',
    desc: 'Deixe mensagens, perguntas ou recados para o time e a comunidade.',
    color: '#FFD600'
  },
  {
    to: '/agenda',
    icon: '📅',
    title: 'Agenda de Jogos',
    desc: 'Confira datas, horários e status dos próximos confrontos.',
    color: '#FFD600'
  },
  {
    to: '/placares',
    icon: '🏆',
    title: 'Placares',
    desc: 'Veja resultados, estatísticas e histórico das partidas.',
    color: '#FFD600'
  },
  {
    to: '/quiz',
    icon: '❓',
    title: 'Quiz / Enquete',
    desc: 'Participe de quizzes e enquetes para testar seus conhecimentos e engajar!',
    color: '#FFD600'
  },
  {
    to: '/ranking',
    icon: '⭐',
    title: 'Ranking',
    desc: 'Veja quem são os fãs mais ativos e engajados da FURIA GG!',
    color: '#FFD600'
  }
];

// Função principal da página
export default function HomePage() {
  return (
    // Container principal da página
    <section id="home" style={{
      width: '100%',
      maxWidth: 1100,
      margin: '0 auto',
      padding: '28px 0 22px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 380
    }}>
      {/* Container de conteúdo */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 24px #181A2012',
        padding: '32px 22px 22px 22px',
        width: '100%',
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 28
      }}>
        {/* Logo da FURIA */}
        <img src="/furia-logo.png" alt="Logo FURIA" style={{
          width: 82,
          marginBottom: 7,
          opacity: 0.97
        }} />
        {/* Título da página */}
        <h1 style={{
          fontWeight: 900,
          fontSize: '2.1em',
          color: '#181A20',
          marginBottom: 7,
          letterSpacing: 0.85
        }}>
          Bem-vindo à <span style={{ color: '#FFD600' }}>FURIA GG</span>!
        </h1>
        {/* Descrição da página */}
        <p style={{
          fontSize: '1.11em',
          color: '#222',
          textAlign: 'center',
          maxWidth: 520,
          marginBottom: 0,
          lineHeight: 1.55
        }}>
          O hub oficial dos fãs da FURIA! Acompanhe, interaja e torça junto: chat, mural, agenda, placares, quizzes, enquetes e ranking dos fãs mais engajados.
        </p>
      </div>
      {/* Container de seções */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
        gap: 26,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 860
      }}>
        {/* Mapeamento de seções */}
        {sections.map(s => (
          <Link to={s.to} key={s.to} style={{
            background: '#fff',
            borderRadius: 13,
            boxShadow: '0 2px 16px #181A2011',
            padding: '22px 16px 18px 16px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.15s, transform 0.15s',
            border: '2px solid #FFD60022',
            minHeight: 155,
            cursor: 'pointer',
            position: 'relative',
            color: '#181A20',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 4px 14px #FFD60033';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 10px #181A2010';
            e.currentTarget.style.transform = 'none';
          }}
          >
            {/* Ícone da seção */}
            <span style={{
              fontSize: '1.75em',
              marginBottom: 13,
              color: s.color,
              textShadow: '0 2px 8px #FFD60022'
            }}>
              {s.icon}
            </span>
            {/* Título da seção */}
            <span style={{
              fontWeight: 800,
              fontSize: '1.13em',
              marginBottom: 11,
              letterSpacing: 0.17,
              color: '#181A20'
            }}>
              {s.title}
            </span>
            {/* Descrição da seção */}
            <span style={{
              fontSize: '1em',
              color: '#222',
              textAlign: 'center',
              lineHeight: 1.46
            }}>
              {s.desc}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
