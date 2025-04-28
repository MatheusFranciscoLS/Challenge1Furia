/**
 * Landing.jsx
 * Tela inicial (Landing Page) da FURIA GG.
 * Exibe informações institucionais, missão, recursos e botões para login.
 *
 * Lógica:
 * - Permite login via Google ou anônimo.
 * - Mostra recursos principais do app.
 *
 * Possíveis melhorias: loading, feedback visual, integração com analytics.
 */
import React from "react";
import "./furia-theme.css";
import { auth, googleProvider, signInAnonymously, signInWithPopup } from "./firebase";
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  return <LandingContent />;
}

function LandingContent() {
  const navigate = useNavigate();

  // Login com Google
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code === "auth/popup-closed-by-user") {
        alert("Login cancelado. Tente novamente!");
      } else {
        alert("Erro ao autenticar: " + (e.message || e.code));
      }
    }
  };

  // Login anônimo
  const handleAnon = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/chat');
    } catch (e) {
      alert("Erro ao entrar como anônimo: " + (e.message || e.code));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#181A20' }}>
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '48px 16px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 900, fontSize: '2.3em', letterSpacing: 1, color: '#181A20', marginBottom: 8, textAlign: 'center' }}>
          Chat dos Fãs da FURIA
        </h2>
        <div style={{ color: '#181A20', fontWeight: 500, fontSize: '1.18em', opacity: 0.92, marginBottom: 32, textAlign: 'center', maxWidth: 640 }}>
          Bem-vindo ao hub oficial dos fãs da FURIA! Aqui você acompanha, interage e torce junto: chat em tempo real, mural de recados, agenda de jogos, placares, quizzes e enquetes.
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 44 }}>
          <FeatureCard title="Chat" desc="Converse ao vivo com outros fãs, comente partidas e participe de interações exclusivas." icon="💬" />
          <FeatureCard title="Mural de Recados" desc="Deixe mensagens, perguntas ou recados para o time e a comunidade." icon="📝" />
          <FeatureCard title="Agenda de Jogos" desc="Confira datas, horários e status dos próximos confrontos." icon="📅" />
          <FeatureCard title="Placares" desc="Veja resultados, estatísticas e histórico das partidas." icon="🏆" />
          <FeatureCard title="Quiz / Enquete" desc="Participe de quizzes e enquetes para testar seus conhecimentos e engajar!" icon="❓" />
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 34 }}>
          <button
            onClick={handleGoogle}
            style={{
              background: '#fff',
              color: '#181A20',
              fontWeight: 700,
              fontSize: '1.18em',
              borderRadius: 8,
              border: '1.5px solid #FFD600',
              padding: '16px 38px',
              boxShadow: '0 2px 12px #FFD60022',
              cursor: 'pointer',
              transition: 'background 0.16s, color 0.16s, box-shadow 0.16s',
              display: 'inline-block',
              marginBottom: 0,
              marginTop: 10,
              minWidth: 180
            }}
            onMouseOver={e => {
              e.target.style.background = '#FFD600';
              e.target.style.color = '#181A20';
              e.target.style.boxShadow = '0 4px 16px #FFD60066';
            }}
            onMouseOut={e => {
              e.target.style.background = '#fff';
              e.target.style.color = '#181A20';
              e.target.style.boxShadow = '0 2px 12px #FFD60022';
            }}
          >Entrar com Google</button>

          <button
            type="button"
            onClick={handleAnon}
            style={{
              background: 'linear-gradient(90deg, #FFD600 60%, #FFF200 100%)',
              color: '#181A20',
              fontWeight: 700,
              fontSize: '1.09em',
              borderRadius: 8,
              padding: '13px 32px',
              textDecoration: 'none',
              boxShadow: '0 2px 12px #FFD60022',
              transition: 'background 0.18s, box-shadow 0.18s',
              letterSpacing: 0.5,
              border: 'none',
              display: 'inline-block',
              cursor: 'pointer',
              marginBottom: 0,
              marginTop: 10,
              minWidth: 180
            }}
            onMouseOver={e=>e.target.style.boxShadow='0 4px 16px #FFD60066'}
            onMouseOut={e=>e.target.style.boxShadow='0 2px 12px #FFD60022'}
          >Entrar como Anônimo</button>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div style={{
      background: '#fff',
      color: '#181A20',
      borderRadius: 14,
      boxShadow: '0 2px 12px #181A2015',
      padding: '26px 20px',
      minWidth: 185,
      maxWidth: 225,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
      border: '1px solid #ECECEC',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: 38, marginBottom: 8 }}>{icon}</span>
      <strong style={{ fontWeight: 800, fontSize: '1.13em', marginBottom: 4 }}>{title}</strong>
      <span style={{ fontSize: '0.99em', opacity: 0.85 }}>{desc}</span>
    </div>
  );
}
