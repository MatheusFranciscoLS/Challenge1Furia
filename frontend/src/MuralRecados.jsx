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
  let date;
  if (typeof ts === 'object' && ts.seconds) {
    date = new Date(ts.seconds * 1000);
  } else if (typeof ts === 'number') {
    // epoch em ms ou s
    date = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
  } else if (typeof ts === 'string' && !isNaN(Number(ts))) {
    // string numérica
    const num = Number(ts);
    date = num > 1e12 ? new Date(num) : new Date(num * 1000);
  } else {
    date = new Date();
  }
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
    const q = query(collection(db, "recados"), orderBy("ts", "desc"), limit(1));
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
      // Apaga todos os recados antigos antes de adicionar o novo
      const q = query(collection(db, "recados"));
      const snap = await (await import('firebase/firestore')).getDocs(q);
      const batch = (await import('firebase/firestore')).writeBatch(db);
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
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
              background: '#181A20',
              borderRadius: 13,
              boxShadow: isTopFan ? '0 2px 14px #FFD60044' : '0 1px 6px #0003',
              border: isTopFan ? '2px solid #FFD600' : '1.5px solid #FFD60022',
              padding: '10px 13px 8px 12px',
              display:'flex', alignItems:'flex-start', gap:10, marginBottom:6, minHeight:38, animation:'fadeInRecado 0.6s cubic-bezier(.62,-0.01,.47,1.01)'
            }}>
              {r.photo && <img src={r.photo} alt={r.user} style={{width:32,height:32,borderRadius:'50%',border:'2px solid #FFD60033',objectFit:'cover',marginRight:2,background:'#111'}} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Nome do usuário e badge, acima do balão */}
                <div style={{display:'flex',alignItems:'center',gap:7,minHeight:24,marginBottom:2}}>

                  <span style={{fontWeight:700, color:isTopFan?'#FFD600':'#fff', letterSpacing:0.2, fontSize:isTopFan?'1.09em':'0.97em', cursor: isTopFan?'pointer':'inherit'}} title={isTopFan?`Top Fã: ${r.user}`:r.user}>{r.user}</span>

                </div>
                {/* Balão da mensagem com horário no rodapé */}
                <div style={{
                  background:'#181A20',
                  borderRadius:12,
                  maxWidth:'94%',
                  color:'#FFD600',
                  fontSize:'1.05em',
                  marginBottom:2,
                  boxShadow:'0 1px 8px #FFD60011',
                  padding:'10px 16px 4px 16px',
                  position:'relative',
                  minHeight:28
                }}>
                  <span
                    className="furia-recado-text"
                    style={{
                      display:'block',
                      textAlign:'left',
                      marginBottom:0,
                      wordBreak:'break-word',
                      whiteSpace:'pre-wrap',
                      overflowWrap:'break-word',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      lineHeight: 1.28,
                    }}
                    dangerouslySetInnerHTML={{ __html: r.text.replace(/(:[^\s:]+:)/g, '<span>$1</span>') }}
                  />
                  <span className="furia-recado-time" style={{
                    display:'block',
                    textAlign:'right',
                    fontSize:'0.87em',
                    fontWeight:500,
                    color:'#FFD60099',
                    marginTop:2,
                    textShadow:'none',
                    letterSpacing:0.09,
                    lineHeight:1.1
                  }}>{formatTime(r.ts)}</span>
                </div>
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
