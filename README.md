# FURIA Fan Chat

![Vercel Deploy](https://img.shields.io/badge/deploy-vercel-brightgreen?logo=vercel)
![React](https://img.shields.io/badge/frontend-react-blue?logo=react)
![Firebase](https://img.shields.io/badge/backend-firebase-orange?logo=firebase)

Bem-vindo ao chat interativo de fãs da FURIA GG! 🦁🔥
Aqui você acompanha jogos, consulta estatísticas, interage com outros fãs e recebe informações em tempo real de todas as modalidades da FURIA GG (CS, Valorant, Rocket League, Rainbow Six, Kings League, e muito mais).

[🔗 Acesse a versão online (Vercel)](https://challenge1-furia.vercel.app)

---

## 📚 Tecnologias Utilizadas

| Camada     | Tecnologia            |
|------------|-----------------------|
| Frontend   | React + Vite          |
| Backend    | Firebase (Firestore/Auth) |
| Deploy     | Vercel                |
| Estilo     | CSS customizado       |

---

Bem-vindo ao chat interativo de fãs da FURIA! 🦁🔥  
Aqui você acompanha jogos, consulta estatísticas, interage com outros fãs e recebe informações em tempo real do time de CS da FURIA.

## 🚀 Funcionalidades Principais

- Chat global em tempo real (Firebase)
- Tela de login moderna: escolha entre Google ou Anônimo
- Autenticação obrigatória: só usuários autenticados acessam o chat
- Modais para agenda de jogos e placares recentes (acesso fácil pela interface)
- Comandos inteligentes para fãs (veja abaixo)
- Status de jogos ao vivo (mock)
- Experiência reativa: após login, acesso imediato ao chat
- Logout seguro: ao sair, retorna para a tela de login

---

## 💬 Comandos do Chat

| Comando                       | O que faz                                             | Exemplo                |
|-------------------------------|-------------------------------------------------------|------------------------|
| `/elenco [modalidade]`        | Mostra elenco de uma modalidade                       | `/elenco cs2`          |
| `/estatisticas [nick]`        | Estatísticas de um jogador                            | `/estatisticas art`    |
| `/modalidades`                | Mostra modalidades disponíveis                        | `/modalidades`         |
| `/curiosidades [modalidade]`  | Curiosidades sobre uma modalidade                     | `/curiosidades valorant`|
| `/help` ou `/comandos`        | Lista todos os comandos                               | `/help`                |

> ⚡ **Agora a agenda de jogos e os placares recentes são acessados pelos botões na barra lateral do chat!**
> Basta clicar em "Agenda de Jogos" ou "Placares Recentes" para abrir os modais com as informações atualizadas.

> Mensagens de erro são sempre orientativas, sugerindo o próximo passo para o fã.

---

## 🖼️ Demonstração

- Prints ou GIFs mostrando:
  - Tela de login com botões "Entrar com Google" e "Entrar como Anônimo"
  - Chat em funcionamento após login
  - Logout retornando à tela de login
  - Abertura dos modais de agenda de jogos e placares recentes
  - Interação do fã com o bot e comandos
- [Link para vídeo de demonstração (YouTube/Drive)](URL_DO_VIDEO)

---

## 🛠️ Como rodar localmente

### Pré-requisitos
- Node.js >= 18
- Conta no Firebase ([crie aqui](https://console.firebase.google.com/))

### Passos
1. Clone o repositório
2. Instale as dependências em `/frontend` e `/backend`:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Configure o Firebase em `/frontend/.env` (use o exemplo `.env.example`)
4. Rode o frontend:
   - `cd frontend && npm run dev`
5. (Opcional) Rode o backend localmente se desejar:
   - `cd backend && npm start`

#### Observações importantes
- **Login obrigatório:** Você só acessa o chat após autenticação (Google ou Anônimo).
- **Popups bloqueados:** Se o botão "Entrar com Google" não abrir, desative bloqueadores de popup/extensões para localhost.
- **Logout:** Ao sair, você retorna automaticamente à tela de login.
- **Erros 400 ou ERR_BLOCKED_BY_CLIENT** ao sair são normais e não afetam o funcionamento.

---

## 📡 Arquitetura e Backend

O frontend está totalmente integrado ao Firebase (Firestore e Auth), dispensando a necessidade de backend próprio para o chat e autenticação.

Caso queira expandir, há um backend Node.js disponível na pasta `/backend` para futuras integrações, rotas customizadas ou tarefas administrativas. Ele não é obrigatório para o funcionamento atual.

### Exemplos de rotas (backend opcional)
- `GET /api/elenco/:modalidade`
- `GET /api/jogos`
- `GET /api/placares`
- `GET /api/modalidades`
- `GET /api/estatisticas/:jogador`
- `GET /api/curiosidades/:modalidade`
- `GET /api/noticias`

Todas retornam mensagens amigáveis e status apropriados para facilitar a experiência do fã.

> **Observação:**
> - Para informações de jogos futuros e placares, utilize os modais na interface.
> - O bot responde dúvidas sobre comandos, jogadores, curiosidades e mais!

---

## 🌟 Expansão futura

- Canais temáticos
- Ranking de fãs
- Integração com APIs de e-sports oficiais
- Reações e perfis customizados
- Deploy do backend para novas integrações

---

---

## 📄 Licença

MIT

---

> Dúvidas ou sugestões? Abra uma [issue](https://github.com/MatheusFranciscoLS/Challenge1Furia/issues) ou entre em contato!

---

**Desenvolvido por fãs, para fãs!**
