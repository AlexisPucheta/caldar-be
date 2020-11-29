//Add your routers
const technicianRouter = require('./technician.js');
const companyRouter = require('./company.js');
const buildingRouter = require('./building.js');
const boilerRouter = require('./boiler.js');
const boilerTypeRouter = require('./boiler-type.js');

//Create your router
var router = require("express").Router();

//Use your router
router.use('/api/technician', technicianRouter);
router.use('/api/company', companyRouter);
router.use('/api/building', buildingRouter);
router.use('/api/boiler', boilerRouter);
router.use('/api/boiler-type', boilerTypeRouter);

module.exports = router;