const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur');

const authenticate = async(req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) throw new Error('Token manquant');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const utilisateur = await Utilisateur.findById(decodedToken._id);

        if (!utilisateur) {
            throw new Error('Utilisateur introuvable.');
        }


        // Vérifier le rôle de l'utilisateur
        if (!utilisateur.isAdmin) {
            // Si l'utilisateur n'est pas un administrateur, le rediriger vers '/indexUser'
            return res.redirect('indexUser');
        }

        req.utilisateur = utilisateur;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification :', error.message);
        return res.status(401).send('Échec d\'authentification : ' + error.message);
    }
};

module.exports = authenticate;