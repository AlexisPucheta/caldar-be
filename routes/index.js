//Add your routers
const technicianRouter = require('./technician.js');

var router = require("express").Router();

//Use your router, for example: router.use('/boiler',boilerRouter)
router.use('/api/technician', technicianRouter);

module.exports = router;