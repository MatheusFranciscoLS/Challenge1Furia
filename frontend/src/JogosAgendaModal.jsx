import React, { useEffect, useState } from "react";


export default function JogosAgendaModal({ open, onClose }) {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setErro("");
    import('./bot-jogos-util').then(({ fetchJogos }) => {
      fetchJogos().then((jogos) => {
        setJogos(jogos);
        setLoading(false);
      }).catch(() => {
        setErro("Erro ao buscar jogos. Tente novamente mais tarde.");
        setLoading(false);
      });
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="furia-modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="furia-modal-content" style={{background:'#222',color:'#fff',borderRadius:12,padding:32,margin:'0 auto',maxWidth:1200,boxShadow:'0 4px 32px #000',position:'relative',width:'90vw',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,fontSize:22,background:'none',border:'none',color:'#FFD600',cursor:'pointer'}} title="Fechar">×</button>
        <h2 style={{marginTop:0,marginBottom:18,color:'#FFD600',textAlign:'center',width:'100%'}}>Agenda de Jogos</h2>
        {loading && <div>Carregando...</div>}
        {erro && <div style={{color:'#FFD600'}}>{erro}</div>}
        {!loading && !erro && (
          jogos.length > 0 ? (
            <div className="furia-agenda-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 22,
              margin: '0 0 8px 0',
              padding: '0 0 32px 0',
              justifyItems: 'center',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center'
            }}>
              <style>{`
                .furia-agenda-grid {
                  width: 100%;
                  justify-content: center;
                }
                .furia-agenda-card {
                  height: 180px !important;
                  min-height: 180px !important;
                  max-height: 180px !important;
                  max-width: 340px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                }
                @media (max-width: 1100px) {
                  .furia-agenda-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    padding-left: 12px !important;
                    padding-right: 12px !important;
                  }
                }
                @media (max-width: 700px) {
                  .furia-agenda-grid {
                    grid-template-columns: 1fr !important;
                    padding-left: 4px !important;
                    padding-right: 4px !important;
                  }
                  .furia-agenda-card {
                    height: 170px !important;
                    min-height: 170px !important;
                    max-height: 170px !important;
                  }
                }
              `}</style>
              {jogos.slice(0, 12).map((j, idx) => (
                <div key={idx} className="furia-agenda-card" style={{
                  background:'#111',
                  borderRadius:14,
                  padding:'18px 10px',
                  boxShadow:'0 2px 8px #0002',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center',
                  justifyContent:'center',
                  minHeight:170,
                  maxHeight:170,
                  minWidth:180,
                  maxWidth:200,
                  width:'100%',
                  border:'1.5px solid #FFD60022',
                  margin:'0 auto'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center',
                    gap: 6,
                    width: '100%',
                    height: '100%',
                    margin: '0',
                    padding: 0
                  }}>
                    <div style={{
                      fontSize: '1.09em',
                      letterSpacing: 0.8,
                      color: '#FFD600',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 2
                    }}>
                      {j.modalidade && j.modalidade.toLowerCase() === 'cs' ? 'Counter-Strike 2' : j.modalidade}
                    </div>
                    <div style={{
                      fontSize: '1.18em',
                      color: '#fff',
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      marginBottom: 2,
                      textShadow: '0 2px 8px #FFD60044, 0 1px 2px #000b',
                      textAlign:'center',
                      width:'100%'
                    }}>
                      FURIA <span style={{color:'#FFD600',fontWeight:900}}>vs</span> <span style={{color:'#FFD600',fontWeight:700}}>{j.adversario}</span>
                    </div>
                    <div style={{
                      fontSize: '1.01em',
                      color: '#FFD600',
                      fontWeight: 600,
                      marginBottom: 2,
                      letterSpacing: 0.2,
                      textAlign:'center',
                      width:'100%'
                    }}>
                      {j.data} &nbsp; <span style={{color:'#fff'}}>às</span> &nbsp;{j.hora}
                    </div>
                    <div style={{
                      fontSize: '0.98em',
                      color: '#fff',
                      fontWeight: 400,
                      opacity: 0.82,
                      marginBottom: 0,
                      textAlign: 'center',
                      letterSpacing: 0.1,
                      width:'100%'
                    }}>
                      {(j.modalidade && j.modalidade.toLowerCase().includes('kings league'))
                        ? 'Kings League'
                        : j.torneio}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum jogo cadastrado no momento.</div>
          )
        )}
      </div>
    </div>
  );
}
