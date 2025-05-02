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

// GET curiosidades por modalidade
const { resolveModalidade } = require('../utils/modalidadeSynonyms');

const Joi = require('joi');
const { validateModalidade } = require('../utils/validators');

/**
 * GET curiosidades por modalidade
 * Query params: page, limit
 * @route GET /:modalidade
 */
/**
 * GET curiosidades por modalidade
 * Retorna erro amigável se o parâmetro não for uma modalidade válida.
 * @route GET /:modalidade
 */
router.get('/:modalidade', async (req, res, next) => {
  const modalidadeParam = req.params.modalidade.toLowerCase();
  const modalidadesValidas = [
    'csgo2', 'valorant', 'rainbowsix', 'apex', 'lol', 'rocketleague', 'pubg', 'kingsleague'
  ];
  
  // Se a modalidade não for válida, retorna todas as modalidades disponíveis
  if (!modalidadeParam || modalidadeParam === 'help' || modalidadeParam === 'comandos' || !modalidadesValidas.includes(modalidadeParam)) {
    return res.status(400).json({ 
      erro: 'Informe uma modalidade válida para consultar curiosidades.',
      modalidades: modalidadesValidas
    });
  }

  const mod = resolveModalidade(modalidadeParam);
  try {
    const doc = await db.collection('curiosidades').doc(mod).get();
    if (!doc.exists) {
      return res.status(404).json({ 
        erro: 'Modalidade não encontrada',
        modalidades: modalidadesValidas
      });
    }
    
    // Limpa as curiosidades para remover caracteres especiais
    const curiosidades = (doc.data().curiosidades || []).map(curiosidade => 
      curiosidade
        .replace(/[^\w\s]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim()

    );

    // Retorna as curiosidades limpas
    // Se o parâmetro random for true, retorna uma curiosidade aleatória
    if (req.query.random === 'true') {
      const randomCuriosity = curiosidades[Math.floor(Math.random() * curiosidades.length)];
      res.json({ curiosidade: randomCuriosity });
    } else {
      res.json({ curiosidades });
    }
  } catch (e) {
    console.error('Erro ao buscar curiosidades:', e);
    next(e);
  }
});

// POST - adicionar curiosidades de uma modalidade
/**
 * POST - adicionar curiosidades de uma modalidade
 * @route POST /:modalidade
 * @access Authenticated
 */
router.post('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { curiosidades } = req.body;
  if (!Array.isArray(curiosidades) || curiosidades.length === 0) {
    return res.status(400).json({ erro: 'Curiosidades deve ser um array não vazio' });
  }
  try {
    await db.collection('curiosidades').doc(mod).set({ curiosidades });
    res.status(201).json({ mensagem: 'Curiosidades salvas com sucesso', curiosidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar curiosidades', detalhes: e.message });
  }
});

// PUT - atualizar curiosidades de uma modalidade
/**
 * PUT - atualizar curiosidades de uma modalidade
 * @route PUT /:modalidade
 * @access Authenticated
 */
router.put('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { curiosidades } = req.body;
  if (!Array.isArray(curiosidades) || curiosidades.length === 0) {
    return res.status(400).json({ erro: 'Curiosidades deve ser um array não vazio' });
  }
  try {
    await db.collection('curiosidades').doc(mod).update({ curiosidades });
    res.json({ mensagem: 'Curiosidades atualizadas com sucesso', curiosidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar curiosidades', detalhes: e.message });
  }
});

// DELETE - remover curiosidades de uma modalidade
/**
 * DELETE - remover curiosidades de uma modalidade
 * @route DELETE /:modalidade
 * @access Authenticated
 */
router.delete('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  try {
    await db.collection('curiosidades').doc(mod).delete();
    res.json({ mensagem: 'Curiosidades removidas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover curiosidades', detalhes: e.message });
  }
});

module.exports = router;
