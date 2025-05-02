/**
 * Centralização dos sinônimos de modalidades
 * @type {Object.<string, string[]>}
 */
const modalidadeMap = {
  'apex': ['apex', 'apex legends'],
  'csgo2': ['csgo2', 'csgo', 'cs:go', 'counter strike', 'counter-strike', 'cs'],
  'kingsleague': ['kingsleague', 'kings league', 'kl', 'futebol 7', 'futebol7', 'fut7'],
  'lol': ['lol', 'league of legends', 'league', 'l.o.l.'],
  'pubg': ['pubg', 'playerunknown', 'playerunknown battlegrounds'],
  'rainbowsix': ['rainbowsix', 'rainbow six', 'rainbow six siege', 'rs6', 'r6'],
  'rocketleague': ['rocketleague', 'rocket league', 'rocket', 'rl'],
  'valorant': ['valorant']
};

/**
 * Resolve o nome canônico da modalidade a partir de um sinônimo ou nome alternativo
 * @param {string} query
 * @returns {string|null}
 */
function resolveModalidade(query) {
  if (!query) return null;
  const q = query.toLowerCase();
  
  // Primeiro verifica se é uma modalidade exata
  if (Object.keys(modalidadeMap).includes(q)) {
    return q;
  }
  
  // Depois verifica os sinônimos
  for (const [key, synonyms] of Object.entries(modalidadeMap)) {
    if (synonyms.some(s => s.toLowerCase() === q)) {
      return key;
    }
  }
  
  // Se não encontrou, retorna null
  return null;
}

module.exports = { modalidadeMap, resolveModalidade };
