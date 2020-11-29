const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.url = 'mongodb+srv://RRT4:hola123@caldar.tkc63.mongodb.net/Caldar?retryWrites=true&w=majority';
// Acá agregan cada uno el nombre de su modelo
db.boilerType = require("./boiler-type")(mongoose);


module.exports = db;