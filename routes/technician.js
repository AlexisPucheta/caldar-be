const technician = require("../controllers/technician");

var router = require("express").Router();

//Retrieve all technicians
router.get('/', technician.findAll);

module.exports = router;