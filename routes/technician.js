const technician = require("../controllers/technician.js");

var router = require("express").Router();

// CRUD routes
//Create technician
router.post('/', technician.createTechnician);
//Retrieve all technicians getTechniciansAll and getTechniciansByAttribute
router.get('/', technician.getTechniciansAll);
//Retrieve technician by ID
router.get('/:id', technician.getTechnicianById);
//Update technician by ID
router.put('/:id', technician.updateTechnicianById);
//Delete technician by ID
router.delete('/:id', technician.deleteTechnicianById);


module.exports = router;