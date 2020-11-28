const Companies = require("../controllers/companies");

var router = require("express").Router();

//Retrieve all companies
//getCompaniesAll and getCompaniesByAttribute
router.get('/', companies.getCompaniesAll);
//Retrieve Companies by ID
router.get('/:id', companies.getCompaniesById);
//Delete Companies by ID
router.delete('/:id', companies.deleteCompaniesById);

module.exports = router;