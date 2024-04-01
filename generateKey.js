const crypto = require('crypto');

// Fonction pour générer une clé secrète aléatoire
function generateSecretKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

// Générer une clé secrète de 256 bits (32 caractères hexadécimaux)
const secretKey = generateSecretKey(32);

console.log('Clé secrète JWT générée :', secretKey);

