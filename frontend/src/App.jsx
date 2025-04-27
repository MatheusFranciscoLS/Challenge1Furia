import React, { useEffect, useState } from 'react';
import Toast from './Toast.jsx';
import Sidebar from './Sidebar.jsx';
import MobileSidebarMenu from './MobileSidebarMenu.jsx';
import MainChat from './MainChat.jsx';
import QuizEnqueteModal from './QuizEnqueteModal.jsx';
import { quizPerguntas } from './QuizData';
import { enquete } from './EnqueteData';
import EventFeed from './EventFeed.jsx';
import { botResponder, BOT_NAME, BOT_PHOTO } from './torcida-bot';
import LiveStatus from './LiveStatus.jsx';
import Message from './Message.jsx';
import ChannelSelector, { CHANNELS } from './ChannelSelector.jsx';
import TopFans from './TopFans.jsx';
import { db, auth, googleProvider, signInAnonymously, signInWithPopup, signOut } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import './furia-theme.css';

import Landing from './Landing.jsx';

/**
 * Componente principal da aplicação FURIA GG
 * Gerencia autenticação, estado global, mensagens, canal e modalidade selecionada.
 * Renderiza Landing, Sidebar, MainChat, EventFeed e outros componentes principais.
 */
function App() {
  // Hooks SEMPRE no topo do componente!
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  // Detecta se está em mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [channel, setChannel] = useState(CHANNELS[0].id);
  // Estado global de modalidade
  const [modalidade, setModalidade] = useState('all');

    // Live status fetch
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setStatus('mock'); // Modo simulado, nunca quebra
      return;
    }
    fetch(apiUrl + '/api/live-status')
      .then(async (res) => {
        try {
          return await res.json();
        } catch {
          return null;
        }
      })
      .then((data) => {
        if (!data) {
          setStatus('indisponivel');
        } else {
          setStatus(data);
        }
      })
      .catch(() => setStatus('indisponivel'));
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Listen messages (Firestore) - só se autenticado
  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'messages'),
      where('channel', '==', channel),
      orderBy('ts')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => doc.data()));
    }, (err) => {
      alert('Erro ao ler mensagens: ' + (err.message || err.code));
      console.error('Erro ao ler mensagens do Firestore:', err);
    });
    return unsub;
  }, [channel, user]);

  const handleGoogleLogin = () => signInWithPopup(auth, googleProvider);

  const handleAnonLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      alert('Erro ao entrar como anônimo: ' + (err.message || err.code));
    }
  };

  const handleLogout = () => signOut(auth);

  // Toast feedback state
  const [toast, setToast] = useState({ type: '', message: '', visible: false });

  // Lista simples de palavras ofensivas para exemplo
  const offensiveWords = [
    'palavrão1', 'palavrão2', 'idiota', 'burro', 'otário', 'merda', 'bosta', 'fdp', 'pqp', 'caralho', 'porra', 'puta', 'fuder', 'foda', 'desgraça', 'arrombado', 'corno', 'viado', 'bicha', 'racista', 'preto', 'macaco', 'branco', 'gordo', 'magro', 'retardado', 'mongol', 'imbecil', 'babaca', 'escroto', 'lixo', 'cuzão', 'cu', 'buceta', 'pau', 'pinto', 'rola', 'boceta', 'bosta', 'bixa', 'viado', 'veado', 'gay', 'lésbica', 'puta', 'prostituta', 'vagabunda', 'puto', 'safado', 'safada', 'cabra', 'puta', 'prostituto', 'prostituta', 'viado', 'veado', 'gay', 'lésbica', 'puta', 'prostituta', 'vagabunda', 'puto', 'safado', 'safada', 'cabra', 'puta', 'prostituto', 'prostituta'
  ];
  function containsOffensive(text) {
    const lower = text.toLowerCase();
    return offensiveWords.some(w => lower.includes(w));
  }
  function isSpam(text) {
    // Mensagem repetida, só emojis, ou flood
    if (/^(.)\1{7,}$/.test(text)) return true;
    if (/^([\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u200d\u2640-\u2642]+)$/u.test(text)) return true;
    if (text.length > 0 && text.length < 5 && /[a-zA-Z]/.test(text) === false) return true;
    return false;
  }

  const handleSend = async function handleSend(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    if (containsOffensive(msg)) {
      setToast({ type: 'error', message: 'Mensagem contém palavras ofensivas. Por favor, respeite a comunidade.', visible: true });
      return;
    }
    if (isSpam(msg)) {
      setToast({ type: 'error', message: 'Mensagem detectada como spam. Por favor, envie algo relevante.', visible: true });
      return;
    }
    try {
      const newMsg = {
        text: msg,
        user: (user && (user.displayName || user.email)) || "Anônimo",
        photo: (user && user.photoURL) || null,
        ts: Date.now(),
        uid: (user && user.uid) || null,
        channel: channel,
      };
      setMsg("");
      await addDoc(collection(db, "messages"), newMsg);
      setToast({ type: 'success', message: 'Mensagem enviada!', visible: true });
      // Se for no canal #bot-ajuda, responde automaticamente
      if (channel === 'bot-ajuda') {
        let resposta = botResponder({ text: msg });
        if (resposta && typeof resposta.then === 'function') {
          resposta = await resposta;
        }
        if (resposta) {
          await addDoc(collection(db, "messages"), {
            text: resposta,
            user: BOT_NAME,
            photo: BOT_PHOTO,
            ts: serverTimestamp(),
            uid: 'furia-bot',
            channel: channel,
          });
          setToast({ type: 'info', message: 'O bot respondeu sua dúvida!', visible: true });
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Erro ao enviar mensagem: ' + (err.message || err.code), visible: true });
    }
  };


  // Rolagem automática para última mensagem
  React.useEffect(() => {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
  }, [messages]);

  // Top fãs para sidebar
  // Novo: ranking por UID, para garantir unicidade e nome/badge sincronizado
  const fanMap = {};
  messages.forEach(m => {
    if (!m.uid) return;
    if (!fanMap[m.uid]) {
      fanMap[m.uid] = { count: 0, lastMsg: m };
    }
    fanMap[m.uid].count++;
    // Sempre pega a mensagem mais recente para nome/foto
    if (!fanMap[m.uid].lastMsg.ts || (m.ts && m.ts > fanMap[m.uid].lastMsg.ts)) {
      fanMap[m.uid].lastMsg = m;
    }
  });
  const medals = ['🥇', '🥈', '🥉', '🎖️', '🏅'];
  const topFansArr = Object.entries(fanMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([uid, { count, lastMsg }], idx) => ({
      user: lastMsg.user,
      count,
      medal: medals[idx] || '',
      uid
    }));
  const topFan = topFansArr.length > 0 ? topFansArr[0].user : null;

  // Placeholder de eventos (em breve: integração real)
  const eventFeed = [
    { icon: '🔥', text: 'FURIA venceu o pistol round!' },
    { icon: '💥', text: 'KSCERATO fez um clutch 1v3!' },
    { icon: '🎯', text: 'arT abriu o bombsite com entry kill.' },
  ];

  // Estados para quiz/enquete
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEnquete, setShowEnquete] = useState(false);

  if (!user) {
    return <Landing />;
  }

  return (
    <>
      {isMobile && (
        <button
          className="furia-hamburger-btn"
          aria-label="Abrir menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span style={{fontSize:'1.5em',fontWeight:700}}>☰</span>
        </button>
      )}
      <MobileSidebarMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        channel={channel}
        setChannel={setChannel}
        topFans={topFansArr}
        user={user}
      />
      <div id="furia-root" className="furia-layout">
        <div className="furia-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:32,paddingBottom:6}}>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
            <div className="furia-logo-wrap">
              <img src="/furia-logo.png" alt="FURIA Logo" className="furia-logo-anim" />
            </div>
            <div>
              <h1 style={{margin:0}}>FURIA Fan Chat</h1>
              <p style={{margin:'2px 0 0 0'}}>Bem-vindo ao chat oficial dos fãs da FURIA!</p>
              <span className="furia-slogan">#FURIAÉNOSSA | Paixão e Garra nos Esportes</span>
            </div>
          </div>
          {/* Top Fãs agora só no header */}
          <TopFans messages={messages} />

          <div className="furia-social-bar" style={{display:'flex',alignItems:'center',gap:18}}>
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
          </div>
        </div>
        <div className="furia-content-row">
          {!isMobile && (
            <Sidebar channel={channel} setChannel={setChannel} user={user} onQuiz={()=>setShowQuiz(true)} onEnquete={()=>setShowEnquete(true)} />
          )}

          <MainChat
            user={user}
            messages={messages}
            handleSend={handleSend}
            msg={msg}
            setMsg={setMsg}
            handleLogout={handleLogout}
            topFan={topFan}
            loading={loading}
            liveStatus={status}
            handleGoogleLogin={handleGoogleLogin}
            handleAnonLogin={handleAnonLogin}
            channel={channel}
            modalidade={modalidade}
            setModalidade={setModalidade}
          />
          <EventFeed events={eventFeed} modalidade={modalidade} setModalidade={setModalidade} />
        </div>
        {/* Modais Quiz/Enquete globais */}
        <QuizEnqueteModal open={showQuiz} onClose={()=>setShowQuiz(false)} title="Quiz FURIA">
          {/* QuizContent é um componente do MainChat, pode ser importado ou movido para cá se necessário */}
          <MainChat.QuizContent />
        </QuizEnqueteModal>
        <QuizEnqueteModal open={showEnquete} onClose={()=>setShowEnquete(false)} title="Enquete FURIA">
          <MainChat.EnqueteContent />
        </QuizEnqueteModal>
      </div>
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </>
  );
}

export default App;

