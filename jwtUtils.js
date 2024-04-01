const jwt = require('jsonwebtoken');

const generateToken = (utilisateurId) => {
  return jwt.sign({ utilisateurId }, 'votre_clé_secrète', { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'votre_clé_secrète');
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
