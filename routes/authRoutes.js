const express = require('express');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/isAdmin');
const authenticate = require('../middleware/auth');

const router = express.Router();



router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('message') });
});

router.post('/login', async(req, res) => {
    const { Email, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe dans la base de données
        const utilisateur = await Utilisateur.findOne({ Email });
        console.log({ utilisateur });
        if (!utilisateur) {
            req.flash('message', 'Email incorrect.');
            return res.redirect('/login');
        }

        // Vérifier si le mot de passe est correct en comparant avec bcrypt
        const passwordMatch = await bcrypt.compare(password, utilisateur.password);
        if (!passwordMatch) {
            req.flash('message', 'Mot de passe incorrect.');
            return res.redirect('/login');
        }
        console.log('ok');
        // Générer un token JWT avec l'ID de l'utilisateur
        const token = jwt.sign({ _id: utilisateur._id }, process.env.JWT_SECRET);


        // Stocker le token dans un cookie avec httponly pour des raisons de sécurité
        res.cookie('jwt', token, { httpOnly: true });
        // Vérifier si l'utilisateur est administrateur
        if (utilisateur.isAdmin) {
            console.log('admin');
            // Rediriger vers la page d'accueil pour l'admin
            return res.redirect('/index');
        } else {
            console.log('user');
            // Rediriger vers la page d'accueil pour les utilisateurs non-administrateurs
            return res.redirect('/indexUser');
        }
    } catch (error) {
        console.error(error);
        req.flash('message', 'Erreur lors de la connexion.');
        res.redirect('/login');
    }
});


router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('message') });
});

router.post('/register', async(req, res) => {
    const { Email, password } = req.body;
    try {
        const utilisateur_existant = await Utilisateur.findOne({ Email });
        if (utilisateur_existant) {
            req.flash('message', 'L\'utilisateur existe déjà.');
            res.redirect('/register');
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const nouvel_utilisateur = new Utilisateur({ Email, password: hashedPassword });
            await nouvel_utilisateur.save();
            req.flash('message', 'Utilisateur enregistré avec succès.');
            res.redirect('/index');
        }
    } catch (error) {
        console.error(error);
        req.flash('message', 'Erreur lors de l\'enregistrement de l\'utilisateur.');
        res.redirect('/register');
    }
});






module.exports = router;