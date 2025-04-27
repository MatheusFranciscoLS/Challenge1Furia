import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from "firebase/firestore";
import Badges from "./Badges";

/**
 * Formata um timestamp Firestore para hora:minuto.
 * @param {object} ts - Timestamp do Firestore
 * @returns {string} Hora formatada
 */
function formatTime(ts) {
  if (!ts) return "";
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Mural de Recados - permite usuários deixarem mensagens públicas.
 * Exibe últimos recados, badge de fãs e formulário de envio.
 *
 * @param {object} props
 *   - user: usuário logado
 *   - topFanUid: UID do top fã
 *   - topFansArr: lista dos top fãs (opcional)
 * @returns {JSX.Element} Mural de recados renderizado
 */
export default function MuralRecados({ user, topFanUid, topFansArr = [] }) {
  const [recado, setRecado] = useState("");
  const [recados, setRecados] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "recados"), orderBy("ts", "desc"), limit(10));
    const unsub = onSnapshot(q, snap => {
      setRecados(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const [enviando, setEnviando] = useState(false);
  async function enviarRecado(e) {
    e.preventDefault();
    if (!recado.trim() || !user || !isAdmin) return;
    setEnviando(true);
    try {
      await addDoc(collection(db, "recados"), {
        text: recado,
        user: user.displayName || user.email || "Anônimo",
        photo: user.photoURL || null,
        ts: serverTimestamp(),
        uid: user.uid || null
      });
      setRecado("");
    } catch (err) {
      alert("Erro ao enviar recado: " + (err.message || err.code));
    } finally {
      setEnviando(false);
    }
  }

  // Badge counts por UID (sincronizado com topFansArr se possível)
  const badgeCounts = {};
  recados.forEach(r => {
    if (!r.uid) return;
    const fan = topFansArr.find(f => f.uid === r.uid);
    badgeCounts[r.uid] = fan ? fan.count : (r.count || recados.filter(x => x.uid === r.uid).length);
  });

  // Defina aqui o UID ou email do admin
  const ADMIN_UID = "admin-uid-aqui"; // Substitua pelo UID real do admin
  const ADMIN_EMAIL = "matheusfran.ls@gmail.com"; // Email do admin atualizado

  const isAdmin = user && (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL);

  return (
    <div className="furia-mural-recados">
      {isAdmin && (
        <form onSubmit={enviarRecado} style={{ display: 'flex', gap: 0, marginBottom: 14, width: '100%', background:'#23242b', borderRadius:14, boxShadow:'0 2px 12px #FFD60022', padding:'4px 6px' }}>
          <input
            className="furia-input"
            style={{ flex: 1, minWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', background:'#181A20', color:'#FFD600', border:'none', fontWeight:600, fontSize:'1.07em', padding:'12px 16px' }}
            value={recado}
            onChange={e => setRecado(e.target.value)}
            placeholder="Escreva Aqui"
            maxLength={80}
            disabled={!user}
            autoComplete="off"
          />
          <button
            type="submit"
            className="furia-btn"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 76, fontWeight: 700, fontSize: '1.08em', height: 44, background:'#FFD600', color:'#181A20', boxShadow:'0 2px 8px #FFD60044', letterSpacing:0.2, border:'none', transition:'background 0.2s' }}
            disabled={!recado.trim() || !user || enviando}
          >{enviando ? 'Enviando...' : 'Enviar'}</button>
        </form>
      )}
      <div className="furia-recados-list" style={{display:'flex',flexDirection:'column',gap:10}}>
        {recados.map(r => {
          const badge = r.uid && badgeCounts[r.uid] !== undefined
            ? <span style={{marginLeft:2,filter:'drop-shadow(0 1px 4px #FFD60066)'}}><Badges count={badgeCounts[r.uid]} /></span>
            : null;
          const isTopFan = topFanUid && r.uid === topFanUid;
          return (
            <div key={r.id} className="furia-recado-item" style={{
              background: isTopFan ? 'linear-gradient(90deg,#FFD60033 60%,#23242b 100%)' : '#23242b',
              borderRadius: 16,
              boxShadow: isTopFan ? '0 2px 12px #FFD60055' : '0 1px 4px #0004',
              border: isTopFan ? '2px solid #FFD600' : '1.5px solid #FFD60022',
              padding: isTopFan ? '13px 18px 13px 10px' : '10px 14px 10px 8px',
              display:'flex', alignItems:'center', gap:12, marginBottom:4, minHeight:54, animation:'fadeInRecado 0.6s cubic-bezier(.62,-0.01,.47,1.01)'
            }}>
              {r.photo && <img src={r.photo} alt={r.user} style={{width:36,height:36,borderRadius:'50%',border:'2px solid #FFD60033',objectFit:'cover',marginRight:2,background:'#111'}} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="furia-recado-user" style={{display:'flex',alignItems:'center',gap:7,minHeight:24,marginBottom:7}}>
                  {isTopFan && (
                    <span style={{fontSize:'1.25em',marginRight:2,filter:'drop-shadow(0 1px 5px #FFD60088)'}} title="Top Fã 🥇">🥇</span>
                  )}
                  <span style={{fontWeight:700, color:isTopFan?'#FFD600':'#fff', letterSpacing:0.2, fontSize:isTopFan?'1.12em':'1em', cursor: isTopFan?'pointer':'inherit'}} title={isTopFan?`Top Fã: ${r.user}`:r.user}>{r.user}</span>
                  {badge}
                </span>
                <span
                  className="furia-recado-text"
                  style={{display:'block',textAlign:'left',padding:'10px 16px 10px 16px',background:'#181A20',borderRadius:12,maxWidth:'94%',color:'#FFD600',fontSize:'1.09em',marginBottom:3,boxShadow:'0 1px 8px #FFD60011'}}
                  dangerouslySetInnerHTML={{ __html: r.text.replace(/(:[^\s:]+:)/g, '<span>$1</span>') }}
                />
                <span className="furia-recado-time" style={{fontSize:'1.04em',fontWeight:700,color:'#FFD600',marginLeft:6,textShadow:'0 1px 4px #0008'}}>{formatTime(r.ts)}</span>
              </div>
            </div>
          );
        })}
        <style>{`
        @keyframes fadeInRecado {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        `}</style>
      </div>
    </div>
  );
}
