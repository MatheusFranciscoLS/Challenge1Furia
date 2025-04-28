import React from "react";
import { Link } from 'react-router-dom';

export default function LandingHeader({ onLogout }) {
  return (
    <header
      className="furia-landing-header"
      style={{
        width: '100%',
        background: '#fff',
        borderBottom: '1px solid #ECECEC',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 72,
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Logo à esquerda */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 140, paddingLeft: 32 }}>
        <Link to="/home">
          <img
            src="/furia-logo.png"
            alt="FURIA Logo"
            style={{ width: 52, height: 52, objectFit: 'contain', marginRight: 12, cursor: 'pointer' }}
          />
        </Link>
      </div>
      {/* Menu central */}
      <nav style={{ display: 'flex', gap: 34 }}>
        <Link to="/chat" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Chat</Link>
        <Link to="/mural" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Mural</Link>
        <Link to="/agenda" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Agenda</Link>
        <Link to="/placares" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Placares</Link>
        <Link to="/quiz" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Quiz/Enquete</Link>
        <Link to="/ranking" style={{ color: '#181A20', textDecoration: 'none', fontWeight: 600, fontSize: '1.08em', letterSpacing: 0.2, padding: '0 4px', borderBottom: '2px solid transparent', transition: 'border 0.15s' }} onMouseOver={e=>e.target.style.borderBottom='2px solid #FFD600'} onMouseOut={e=>e.target.style.borderBottom='2px solid transparent'}>Ranking</Link>
      </nav>
      {/* Redes sociais à direita */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 140, paddingRight: 32 }}>
        <a href="https://twitter.com/furiagg" target="_blank" rel="noopener noreferrer" title="Twitter/X" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#181A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.46 5.94c-.77.34-1.6.57-2.47.67a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.11 4.7a4.28 4.28 0 0 0 1.33 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.29 4.29 0 0 0 3.43 4.2c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57.84-.6 1.57-1.35 2.15-2.2z"></path></svg>
        </a>
        <a href="https://instagram.com/furiagg" target="_blank" rel="noopener noreferrer" title="Instagram" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#181A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
        </a>
        <a href="https://youtube.com/furiagg" target="_blank" rel="noopener noreferrer" title="YouTube" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#181A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        </a>
        <a href="https://tiktok.com/@furiagg" target="_blank" rel="noopener noreferrer" title="TikTok" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#181A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17a5 5 0 1 1 0-10h2v8a3 3 0 1 0 3-3h2a5 5 0 1 1-7 5z"/></svg>
        </a>
        <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:6,background:'#FFD600',color:'#181A20',border:'none',borderRadius:8,padding:'7px 16px',fontWeight:700,fontSize:'1em',marginLeft:18,cursor:'pointer',boxShadow:'0 2px 8px #FFD60022',transition:'background 0.15s'}} title="Sair">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#181A20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:2}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>
    </header>
  );
}
