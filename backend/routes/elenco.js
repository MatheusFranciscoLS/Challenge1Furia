const express = require('express');
const router = express.Router();
const db = require('../firebase');
const admin = require('firebase-admin');

/**
 * Middleware de autenticação Firebase
 * Verifica o token Bearer e adiciona o usuário autenticado em req.user
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação ausente' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

// GET elenco por modalidade
const { resolveModalidade } = require('../utils/modalidadeSynonyms');

/**
 * GET elenco por modalidade
 * @route GET /:modalidade
 */
/**
 * GET elenco por modalidade
 * Retorna erro amigável se o parâmetro não for uma modalidade válida.
 * @route GET /:modalidade
 */
router.get('/:modalidade', async (req, res) => {
  const modalidadeParam = req.params.modalidade.toLowerCase();
const modalidadesValidas = [
  'csgo2','csgo','valorant','lol','rocketleague','apex','rainbowsix','kingsleague','fifa'
];
if (!modalidadeParam || modalidadeParam === 'help' || modalidadeParam === 'comandos' || !modalidadesValidas.includes(modalidadeParam)) {
  return res.status(400).json({ erro: 'Informe uma modalidade válida para consultar o elenco. Consulte /modalidades para ver as opções.' });
}
const mod = resolveModalidade(modalidadeParam);
console.log('Recebida requisição para elenco da modalidade:', mod);
try {
    const doc = await db.collection('elenco').doc(mod).get();
    if (!doc.exists) {
      console.warn('Modalidade não encontrada no Firestore:', mod);
      return res.status(400).json({ erro: 'Informe uma modalidade válida para consultar o elenco. Consulte /modalidades para ver as opções.' });
    }
    res.json({ elenco: doc.data().jogadores });
  } catch (e) {
    console.error('Erro ao buscar elenco para', mod, ':', e);
    res.status(500).json({ erro: 'Erro ao buscar elenco', detalhes: e.message });
  }
});

// POST - adicionar elenco de uma modalidade
/**
 * POST - adicionar elenco de uma modalidade
 * @route POST /:modalidade
 * @access Authenticated
 */
router.post('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { jogadores } = req.body;
  if (!Array.isArray(jogadores) || jogadores.length === 0) {
    return res.status(400).json({ erro: 'Jogadores deve ser um array não vazio' });
  }
  try {
    await db.collection('elenco').doc(mod).set({ jogadores });
    res.status(201).json({ mensagem: 'Elenco salvo com sucesso', elenco: jogadores });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar elenco', detalhes: e.message });
  }
});

// PUT - atualizar elenco de uma modalidade
/**
 * PUT - atualizar elenco de uma modalidade
 * @route PUT /:modalidade
 * @access Authenticated
 */
router.put('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { jogadores } = req.body;
  if (!Array.isArray(jogadores) || jogadores.length === 0) {
    return res.status(400).json({ erro: 'Jogadores deve ser um array não vazio' });
  }
  try {
    await db.collection('elenco').doc(mod).update({ jogadores });
    res.json({ mensagem: 'Elenco atualizado com sucesso', elenco: jogadores });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar elenco', detalhes: e.message });
  }
});

// DELETE - remover elenco de uma modalidade
/**
 * DELETE - remover elenco de uma modalidade
 * @route DELETE /:modalidade
 * @access Authenticated
 */
router.delete('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  try {
    await db.collection('elenco').doc(mod).delete();
    res.json({ mensagem: 'Elenco removido com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover elenco', detalhes: e.message });
  }
});

module.exports = router;
