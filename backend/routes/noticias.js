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

// GET notícias (com filtro opcional por modalidade)
const { resolveModalidade } = require('../utils/modalidadeSynonyms');

const Joi = require('joi');
const { validateModalidade } = require('../utils/validators');

/**
 * GET notícias (com filtro opcional por modalidade)
 * Query params: modalidade, page, limit
 * @route GET /
 */
/**
 * GET noticias
 * Retorna erro amigável se houver query inválida (ex: comandos reservados).
 * @route GET /
 */
router.get('/', async (req, res, next) => {
  const { modalidade, page = 1, limit = 20 } = req.query;
  if (modalidade) {
    const { error } = validateModalidade(modalidade);
    if (error) return res.status(400).json({ erro: 'Modalidade inválida' });
  }
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  try {
    let query = db.collection('noticias');
    if (modalidade) {
      const modKey = resolveModalidade(modalidade);
      query = query.where('modalidade', '==', modKey);
    }
    const snapshot = await query.get();
    let noticias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Paginação manual
    const start = (pageNum - 1) * limitNum;
    noticias = noticias.slice(start, start + limitNum);
    res.json({ noticias, page: pageNum, limit: limitNum });
  } catch (e) {
    next(e);
  }
});

// POST - adicionar notícia
/**
 * POST - adicionar notícia
 * @route POST /
 * @access Authenticated
 */
router.post('/', authenticate, async (req, res) => {
  const { modalidade, titulo, data, texto } = req.body;
  if (!modalidade || !titulo || !data || !texto) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, titulo, data, texto' });
  }
  try {
    const docRef = await db.collection('noticias').add({ modalidade: modalidade.toLowerCase(), titulo, data, texto });
    res.status(201).json({ mensagem: 'Notícia adicionada', id: docRef.id });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao adicionar notícia', detalhes: e.message });
  }
});

// PUT - atualizar notícia
/**
 * PUT - atualizar notícia
 * @route PUT /:id
 * @access Authenticated
 */
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { modalidade, titulo, data, texto } = req.body;
  if (!modalidade || !titulo || !data || !texto) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, titulo, data, texto' });
  }
  try {
    await db.collection('noticias').doc(id).update({ modalidade: modalidade.toLowerCase(), titulo, data, texto });
    res.json({ mensagem: 'Notícia atualizada com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar notícia', detalhes: e.message });
  }
});

// DELETE - remover notícia
/**
 * DELETE - remover notícia
 * @route DELETE /:id
 * @access Authenticated
 */
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('noticias').doc(id).delete();
    res.json({ mensagem: 'Notícia removida com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover notícia', detalhes: e.message });
  }
});

module.exports = router;
