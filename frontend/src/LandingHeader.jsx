import React from "react";

// Header exclusivo para Landing Page, com visual diferenciado
export default function LandingHeader() {
  return (
    <header
      className="furia-landing-header"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, #181A20 80%, #FFD60022 100%)',
        boxShadow: '0 4px 32px #000b',
        padding: '24px 0 18px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        borderBottom: '2px solid #FFD60044',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <img
          src="/furia-logo.png"
          alt="FURIA Logo"
          style={{ width: 64, height: 64, borderRadius: 14, boxShadow: '0 2px 16px #FFD60044' }}
        />
        <div style={{ textAlign: 'left' }}>
          <h1
            style={{
              fontWeight: 900,
              fontSize: '2.1em',
              letterSpacing: 2,
              color: '#FFD600',
              margin: 0,
              textShadow: '0 2px 12px #FFD60033, 0 1px 2px #000b',
            }}
          >
            FURIA GG
          </h1>
          <span style={{ color: '#fff', fontWeight: 500, fontSize: '1.06em', opacity: 0.88 }}>
            Bem-vindo à comunidade oficial dos fãs
          </span>
        </div>
      </div>
      <nav
        className="furia-social-bar"
        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, position: 'absolute', right: 36 }}
      >
        <a href="https://twitter.com/furiagg" target="_blank" rel="noopener noreferrer" title="Twitter/X" className="furia-social-link">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.46 5.94c-.77.34-1.6.57-2.47.67a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.11 4.7a4.28 4.28 0 0 0 1.33 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.29 4.29 0 0 0 3.43 4.2c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57.84-.6 1.57-1.35 2.15-2.2z"></path></svg>
        </a>
        <a href="https://instagram.com/furiagg" target="_blank" rel="noopener noreferrer" title="Instagram" className="furia-social-link">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
        </a>
        <a href="https://youtube.com/furiagg" target="_blank" rel="noopener noreferrer" title="YouTube" className="furia-social-link">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
        </a>
        <a href="https://tiktok.com/@furiagg" target="_blank" rel="noopener noreferrer" title="TikTok" className="furia-social-link">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17a5 5 0 1 1 0-10h2v8a3 3 0 1 0 3-3h2a5 5 0 1 1-7 5z"/></svg>
        </a>
      </nav>
    </header>
  );
}
