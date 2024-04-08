const mongoose = require('mongoose');
const { Schema } = mongoose;

const salleSchema = new Schema({
    NomS: { type: String, required: true },
    Nom: { type: String, required: true },
    Capacite: { type: Number, required: true },
    Equipments: [{ type: String }],
    Disponibilites: [{
        dateDebut: { type: Date, required: true },
        heureDebut: { type: String, required: true },
        dateFin: { type: Date, required: true },
        heureFin: { type: String, required: true }
    }],
    Tarif: { type: Number, required: true }

});

const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle;