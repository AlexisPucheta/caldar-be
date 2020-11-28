//Add your routers
const technicianRouter = require('./technician.js');
const companyRouter = requiere('./companies.js');

var router = require("express").Router();

//Use your router
router.use('/api/technician', technicianRouter);
router.use('/api/company', companyRouter);

module.exports = router;