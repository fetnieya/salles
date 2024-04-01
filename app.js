require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const authenticate = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const salleRoutes = require('./routes/salleRoutes');
const reservRoutes = require('./routes/reservRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');


const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());



// Configuration de mongoose et connexion à la base de données
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to the database!"));


// Configuration du moteur de template EJS
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
// Middleware pour gérer les sessions
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

// Middleware pour parser le body des requêtes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware pour les messages flash
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(flash());

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/index', authenticate, (req, res) => {
    res.render('index', { utilisateur: req.utilisateur._id });
});

app.get('/indexUser', (req, res) => {
    const utilisateur = jwt.decode(req.cookies);
    res.render('indexUser', { utilisateur });
});


// Middleware pour les routes de gestion des salles
app.use('/', salleRoutes);

// Middleware pour l'authentification des routes protégées
app.use('/', authRoutes);
//app.use(authenticate);

// Route de déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

app.use("/", reservRoutes);
app.use("/reservRoutes", reservRoutes);

app.use('/admin', require('./routes/adminRoutes'));
















// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});