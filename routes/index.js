//Add your routers
const technicianRouter = require('./technician.js');

var router = require("express").Router();

//Use your router
router.use('/api/technician', technicianRouter);

module.exports = router;