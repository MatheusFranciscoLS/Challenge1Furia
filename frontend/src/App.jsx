import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast.jsx';

import MobileSidebarMenu from './MobileSidebarMenu.jsx';
import MainChat from './MainChat.jsx';
import QuizEnqueteModal from './QuizEnqueteModal.jsx';




import LandingHeader from './LandingHeader';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MuralPage from './pages/MuralPage';
import AgendaPage from './pages/AgendaPage';
import PlacaresPage from './pages/PlacaresPage';
import QuizPage from './pages/QuizPage';
import RankingPage from './pages/RankingPage';
import ChannelSelector, { CHANNELS } from './ChannelSelector.jsx';
import TopFans from './TopFans.jsx';
import { db, signOut, auth } from './firebase';
import { botResponder, BOT_NAME, BOT_PHOTO } from './torcida-bot';
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
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  // Detecta se está em mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [channel, setChannel] = useState(CHANNELS[0].id);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
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

  // Toast feedback state
  const [toast, setToast] = useState({ type: '', message: '', visible: false });

  // Lista simples de palavras ofensivas (exemplo, pode ser centralizada em utils futuramente)
  const offensiveWords = [
    'palavrão1', 'palavrão2', 'idiota', 'burro', 'otário', 'merda', 'bosta', 'fdp', 'pqp', 'caralho', 'porra', 'puta', 'fuder', 'foda', 'desgraça', 'arrombado', 'corno', 'viado', 'bicha', 'racista', 'preto', 'macaco', 'branco', 'gordo', 'magro', 'retardado', 'mongol', 'imbecil', 'babaca', 'escroto', 'lixo', 'cuzão', 'cu', 'buceta', 'pau', 'pinto', 'rola', 'boceta', 'bosta', 'bixa', 'viado', 'veado', 'gay', 'lésbica', 'puta', 'prostituta', 'vagabunda', 'puto', 'safado', 'safada', 'cabra', 'puta', 'prostituto', 'prostituta', 'viado', 'veado', 'gay', 'lésbica', 'puta', 'prostituta', 'vagabunda', 'puto', 'safado', 'safada', 'cabra', 'puta', 'prostituto', 'prostituta'
  ];
  // Função utilitária para checar palavras ofensivas
  function containsOffensive(text) {
    const lower = text.toLowerCase();
    return offensiveWords.some(w => lower.includes(w));
  }
  // Função utilitária para detectar spam
  function isSpam(text) {
    // Mensagem repetida, só emojis, ou flood
    if (/^(.)\1{7,}$/.test(text)) return true;
    // Regex simplificado para detectar apenas emojis comuns
    if (/^([\uD800-\uDBFF][\uDC00-\uDFFF])+$/u.test(text)) return true;
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

  // Top fãs geral: ranking por UID considerando TODAS as mensagens
  // Para isso, precisamos buscar todas as mensagens de todos os canais
  const [allMessages, setAllMessages] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('ts'));
    const unsub = onSnapshot(q, (snap) => {
      setAllMessages(snap.docs.map(doc => doc.data()));
    });
    return unsub;
  }, []);

  const fanMap = {};
  allMessages.forEach(m => {
    if (!m.uid) return;
    if (m.uid === 'furia-bot' || (m.user && m.user.trim().toLowerCase() === 'torcida furia')) return;
    if (!fanMap[m.uid]) {
      fanMap[m.uid] = { count: 0, lastMsg: m };
    }
    fanMap[m.uid].count++;
    if (!fanMap[m.uid].lastMsg.ts || (m.ts && m.ts > fanMap[m.uid].lastMsg.ts)) {
      fanMap[m.uid].lastMsg = m;
    }
  });
  const medals = ['🥇', '🥈', '🥉', '🎖️', '🏅'];
  const topFansArr = Object.entries(fanMap)
    .filter(([uid, fan]) => uid !== 'furia-bot' && (fan.lastMsg.user !== 'Torcida FURIA'))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([uid, { count, lastMsg }], idx) => ({
      user: lastMsg.user,
      count,
      medal: medals[idx] || '',
      uid
    }));
  const topFan = topFansArr.length > 0 ? topFansArr[0].user : null;

  // Estados para quiz/enquete
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEnquete, setShowEnquete] = useState(false);

  // Função de logout
  const navigate = useNavigate();
  function handleLogout() {
    signOut(auth)
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        setToast({ type: 'error', message: 'Erro ao sair: ' + (error.message || error.code), visible: true });
      });
  }

  // Renderização condicional: mostra Landing se não autenticado
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
          <span style={{ fontSize: '1.5em', fontWeight: 700 }}>☰</span>
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
      <div id="furia-root" className="furia-app-root">
        <LandingHeader user={user} onLogout={handleLogout} />
        <div className="furia-content-row">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage messages={messages} user={user} msg={msg} setMsg={setMsg} handleSend={handleSend} topFan={topFan} channel={channel} setChannel={setChannel} />} />
            <Route path="/mural" element={<MuralPage user={user} />} />
            <Route path="/agenda" element={
              <>
                {}
                <AgendaPage />
                
              </>
            } />
            <Route path="/placares" element={
              <>
                {}
                <PlacaresPage />
                
              </>
            } />
            <Route path="/quiz" element={
              <>
                {}
                <QuizPage showQuiz={showQuiz} setShowQuiz={setShowQuiz} showEnquete={showEnquete} setShowEnquete={setShowEnquete} />
                
              </>
            } />
            <Route path="/ranking" element={
              <>
                {}
                <RankingPage allMessages={allMessages} />
                
              </>
            } />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        {/* Modais Quiz/Enquete globais */}
        <QuizEnqueteModal open={showQuiz} onClose={()=>setShowQuiz(false)} title="Quiz FURIA">
          <MainChat.QuizContent />
        </QuizEnqueteModal>
        <QuizEnqueteModal open={showEnquete} onClose={()=>setShowEnquete(false)} title="Enquete FURIA">
          <MainChat.EnqueteContent />
        </QuizEnqueteModal>
        <Toast
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast(t => ({ ...t, visible: false }))}
        />
      </div>
    </>
  );
}

export default App;
