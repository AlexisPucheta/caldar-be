//Add your routers
const technicianRouter = require('./technician.js');
const companyRouter = require('./company.js');
const buildingRouter = require('./building.js');

//Create your router
var router = require("express").Router();

//Use your router
router.use('/api/technician', technicianRouter);
router.use('/api/company', companyRouter);
router.use('/api/building', buildingRouter);

module.exports = router;