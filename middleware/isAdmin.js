// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
    if (req.utilisateur && req.utilisateur.isAdmin) {
      // L'utilisateur est administrateur, continuer
      next();
    } else {
      // L'utilisateur n'est pas administrateur, renvoyer une erreur ou rediriger
      res.status(403).send('Accès interdit : seuls les administrateurs peuvent accéder à cette ressource.');
    }
  };
  
  module.exports = isAdmin;
  