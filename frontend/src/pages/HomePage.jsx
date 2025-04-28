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
      padding: '40px 0 32px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 480
    }}>
      {/* Container de conteúdo */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 32px #181A2014',
        padding: '40px 32px 32px 32px',
        width: '100%',
        maxWidth: 700,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 36
      }}>
        {/* Logo da FURIA */}
        <img src="/furia-logo.png" alt="Logo FURIA" style={{
          width: 94,
          marginBottom: 12,
          opacity: 0.97
        }} />
        {/* Título da página */}
        <h1 style={{
          fontWeight: 900,
          fontSize: '2.6em',
          color: '#181A20',
          marginBottom: 10,
          letterSpacing: 1
        }}>
          Bem-vindo à <span style={{ color: '#FFD600' }}>FURIA GG</span>!
        </h1>
        {/* Descrição da página */}
        <p style={{
          fontSize: '1.18em',
          color: '#222',
          textAlign: 'center',
          maxWidth: 520,
          marginBottom: 0,
          lineHeight: 1.6
        }}>
          O hub oficial dos fãs da FURIA! Acompanhe, interaja e torça junto: chat em tempo real, mural de recados, agenda de jogos, placares, quizzes, enquetes e ranking dos fãs mais engajados.
        </p>
      </div>
      {/* Container de seções */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 32,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 900
      }}>
        {/* Mapeamento de seções */}
        {sections.map(s => (
          <Link to={s.to} key={s.to} style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 18px #181A2010',
            padding: '32px 22px 28px 22px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.18s, transform 0.18s',
            border: '2px solid #FFD60022',
            minHeight: 220,
            cursor: 'pointer',
            position: 'relative',
            color: '#181A20',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 4px 28px #FFD60033';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 18px #181A2010';
            e.currentTarget.style.transform = 'none';
          }}
          >
            {/* Ícone da seção */}
            <span style={{
              fontSize: '2.3em',
              marginBottom: 14,
              color: s.color,
              textShadow: '0 2px 8px #FFD60022'
            }}>
              {s.icon}
            </span>
            {/* Título da seção */}
            <span style={{
              fontWeight: 800,
              fontSize: '1.18em',
              marginBottom: 10,
              letterSpacing: 0.2,
              color: '#181A20'
            }}>
              {s.title}
            </span>
            {/* Descrição da seção */}
            <span style={{
              fontSize: '1.03em',
              color: '#222',
              textAlign: 'center',
              lineHeight: 1.5
            }}>
              {s.desc}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
