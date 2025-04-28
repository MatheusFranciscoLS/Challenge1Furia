import React, { useState, useEffect, useRef } from "react";
import styles from "./QuizPage.module.css";

// Utilitário para embaralhar perguntas
function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Mock de quizzes temáticos
const quizzes = {
  geral: [
    {
      pergunta: "Qual é o animal símbolo da FURIA?",
      opcoes: ["Leão", "Pantera", "Lobo", "Urso"],
      resposta: 1
    },
    {
      pergunta: "Em que ano a FURIA foi fundada?",
      opcoes: ["2015", "2017", "2019", "2021"],
      resposta: 1
    },
    {
      pergunta: "Qual dessas modalidades NÃO faz parte da FURIA?",
      opcoes: ["CS2", "Valorant", "Rugby", "Rocket League"],
      resposta: 2
    }
  ],
  jogadores: [
    {
      pergunta: "Quem é o IGL do time de CS2 da FURIA?",
      opcoes: ["KSCERATO", "arT", "yuurih", "chelo"],
      resposta: 1
    }
  ]
};

// Mock de enquete
const enqueteMock = {
  pergunta: "Qual modalidade você mais acompanha na FURIA?",
  opcoes: ["CS2", "Valorant", "R6", "Rocket League"],
  votos: [12, 9, 5, 4]
};

// Mock de ranking
const mockRanking = [
  { nome: "Você", pontos: 0 },
  { nome: "Fã 1", pontos: 3 },
  { nome: "Fã 2", pontos: 2 },
  { nome: "Fã 3", pontos: 2 },
  { nome: "Fã 4", pontos: 1 }
];

// Tempo limite para responder cada pergunta
const TIMER = 20;

export default function QuizPage() {
  // Estado do quiz
  const [tema] = useState("geral"); // Tema selecionado
  const [quizList, setQuizList] = useState(() => shuffle(quizzes[tema])); // Perguntas embaralhadas
  const [perguntaAtual, setPerguntaAtual] = useState(0); // Índice da pergunta atual
  const [respostaSelecionada, setRespostaSelecionada] = useState(null); // Opção escolhida
  const [respondido, setRespondido] = useState(false); // Se já respondeu
  const [acertos, setAcertos] = useState(0); // Pontuação
  const [finalizado, setFinalizado] = useState(false); // Quiz finalizado
  const [timer, setTimer] = useState(TIMER); // Timer
  const timerRef = useRef();
  const [ranking, setRanking] = useState(mockRanking); // Ranking local
  const [showConfetti, setShowConfetti] = useState(false); // Efeito de acerto
  const [soundOn] = useState(true); // Som de feedback (pode virar toggle futuramente)

  // Estado da enquete
  const [enqueteSelecionada, setEnqueteSelecionada] = useState(null);
  const [enqueteVotada, setEnqueteVotada] = useState(false);
  const [votos, setVotos] = useState([...enqueteMock.votos]);
  

  // Controle do timer para cada pergunta
  useEffect(() => {
    if (finalizado || respondido) return;
    setTimer(TIMER);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRespondido(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [perguntaAtual, finalizado, respondido, handleResponder, proximaPergunta]);

  // Efeito de confete ao acertar
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 1700);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  // Feedback sonoro (acerto/erro)
  useEffect(() => {
    if (!respondido || !soundOn) return;
    let audio;
    if (respostaSelecionada === quizList[perguntaAtual].resposta) {
      audio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa9d6b.mp3");
    } else {
      audio = new Audio("/sounds/error.mp3");
    }
    audio.volume = 0.2;
    audio.play();
  }, [respondido, respostaSelecionada, quizList, perguntaAtual, soundOn]);

  // Atalhos de teclado para responder rapidamente
  useEffect(() => {
    function keyHandler(e) {
      if (finalizado) return;
      if (!respondido && e.key >= "1" && e.key <= String(quizList[perguntaAtual].opcoes.length)) {
        handleResponder(Number(e.key) - 1);
      } else if (respondido && (e.key === "Enter" || e.key === " ")) {
        proximaPergunta();
      }
    }
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [respondido, perguntaAtual, finalizado, quizList]);

  // Lógica para responder uma pergunta
  function handleResponder(idx) {
    setRespostaSelecionada(idx);
    setRespondido(true);
    if (idx === quizList[perguntaAtual].resposta) setAcertos(a => a + 1);
  }

  // Avançar para a próxima pergunta ou finalizar o quiz
  function proximaPergunta() {
    if (perguntaAtual < quizList.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
      setRespostaSelecionada(null);
      setRespondido(false);
    } else {
      setFinalizado(true);
      setRanking((rk) => {
        let novo = rk.slice();
        novo[0].pontos = acertos;
        novo.sort((a, b) => b.pontos - a.pontos);
        return novo;
      });
    }
  }

  // Reiniciar quiz
  function reiniciarQuiz() {
    setQuizList(shuffle(quizzes[tema]));
    setPerguntaAtual(0);
    setRespostaSelecionada(null);
    setRespondido(false);
    setAcertos(0);
    setFinalizado(false);
    setRanking(mockRanking.map((rk, i) => i === 0 ? { ...rk, pontos: 0 } : rk));
  }

  // Votar na enquete
  function votarEnquete(idx) {
    setEnqueteSelecionada(idx);
    setEnqueteVotada(true);
    const novosVotos = votos.slice();
    novosVotos[idx] += 1;
    setVotos(novosVotos);
  }

  // Cálculos auxiliares
  const totalVotos = votos.reduce((a, b) => a + b, 0);
  const quiz = quizList[perguntaAtual];
  const progresso = Math.round(((perguntaAtual) / quizList.length) * 100);

  // Renderização principal
  return (
    <section className={styles.quizContainer}>
      <h2 className={styles.quizTitle}>Quiz & Enquete FURIA</h2>
      {/* Barra de progresso do quiz */}
      <div className={styles.quizProgressBarWrapper}>
        <div className={styles.quizProgressBar}>
          <div
            className={styles.quizProgressBarFill}
            style={{ width: finalizado ? "100%" : progresso + "%" }}
          ></div>
        </div>
        <div className={styles.quizProgressCountBadge}>
          {finalizado ? "Quiz finalizado" : (
            <>
              <span className={styles.quizProgressCountNum}>Pergunta</span>
              <span className={styles.quizProgressCountCurrent}>{perguntaAtual + 1}</span>
              <span className={styles.quizProgressCountDe}> de </span>
              <span className={styles.quizProgressCountTotal}>{quizList.length}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.quizContentWrapper}>
        {/* Quiz principal */}
        <div className={styles.quizBox}>
          {!finalizado ? (
            <>
              {/* Pergunta atual */}
              <div className={styles.quizQuestion}>{quiz.pergunta}</div>
              {/* Barra de tempo */}
              <div className={styles.quizTimerBarWrapper}>
                <div className={styles.quizTimerBar}>
                  <div
                    className={styles.quizTimerBarFill}
                    style={{ width: (timer / TIMER) * 100 + "%" }}
                  ></div>
                </div>
                <span className={styles.quizTimerText}>{timer}s</span>
              </div>
              {/* Opções de resposta */}
              <div className={styles.quizOptions}>
                {quiz.opcoes.map((op, idx) => (
                  <button
                    key={op}
                    className={
                      styles.quizOption +
                      (respondido
                        ? idx === quiz.resposta
                          ? " " + styles.quizOptionCorrect
                          : respostaSelecionada === idx
                          ? " " + styles.quizOptionWrong
                          : ""
                        : respostaSelecionada === idx
                        ? " " + styles.quizOptionSelected
                        : "")
                    }
                    disabled={respondido || timer === 0}
                    tabIndex={0}
                    onClick={() => handleResponder(idx)}
                  >
                    {op}
                  </button>
                ))}
              </div>
              {/* Efeito confete ao acertar */}
              {showConfetti && <div className={styles.quizConfetti}>🎉</div>}
              {/* Feedback após resposta */}
              {respondido && (
                <div className={styles.quizFeedback}>
                  {respostaSelecionada === quiz.resposta ? (
                    <span className={styles.quizFeedbackCorrect}>✔ Resposta correta!</span>
                  ) : timer === 0 ? (
                    <span className={styles.quizFeedbackWrong}>⏰ Tempo esgotado! O correto é <b>{quiz.opcoes[quiz.resposta]}</b>.</span>
                  ) : (
                    <span className={styles.quizFeedbackWrong}>
                      ✖ Resposta incorreta. O correto é <b>{quiz.opcoes[quiz.resposta]}</b>.
                    </span>
                  )}
                  <button className={styles.quizNextBtn} onClick={proximaPergunta}>
                    {perguntaAtual === quizList.length - 1 ? "Finalizar" : "Próxima"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.quizFinalizado}>
              <span className={styles.quizFinalizadoTitulo}>Quiz finalizado!</span>
              <div className={styles.quizFinalizadoPontuacao}>
                Você acertou <b>{acertos}</b> de <b>{quizList.length}</b> perguntas.
              </div>
              <button className={styles.quizRestartBtn} onClick={reiniciarQuiz}>
                Tentar novamente
              </button>
              <div className={styles.quizRankingBox}>
                <h3>Ranking local</h3>
                <ol>
                  {ranking.map((rk) => (
                    <li key={rk.nome} className={rk.nome === "Você" ? styles.quizRankingVoce : ""}>
                      {rk.nome}: {rk.pontos} pts
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
        {/* Enquete lateral */}
        <div className={styles.enqueteBox}>
          <div className={styles.enqueteTitle}>Enquete</div>
          <div className={styles.enqueteQuestion}>{enqueteMock.pergunta}</div>
          <div className={styles.enqueteOptions}>
            {enqueteMock.opcoes.map((op, idx) => (
              <button
                key={op}
                className={
                  styles.enqueteOption +
                  (enqueteVotada && enqueteSelecionada === idx ? " " + styles.enqueteOptionSelected : "")
                }
                disabled={enqueteVotada}
                onClick={() => votarEnquete(idx)}
              >
                {op}
              </button>
            ))}
          </div>
          {enqueteVotada && (
            <div className={styles.enqueteFeedback}>
              <div className={styles.enqueteResultados}>
                {enqueteMock.opcoes.map((op, idx) => (
                  <div key={op} className={styles.enqueteResultadoLinha}>
                    <span>{op}</span>
                    <div className={styles.enqueteBarWrapper}>
                      <div
                        className={styles.enqueteBar}
                        style={{ width: (votos[idx] / totalVotos) * 100 + "%" }}
                      ></div>
                      <span className={styles.enquetePorcentagem}>
                        {Math.round((votos[idx] / totalVotos) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
                <div className={styles.enqueteTotalVotos}>Total de votos: {totalVotos}</div>
              </div>
              <div className={styles.enqueteComentarioBox}>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
