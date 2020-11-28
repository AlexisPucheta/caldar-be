const company = require("../controllers/company.js");

var router = require("express").Router();

//Retrieve all companies
//getCompaniesAll and getCompaniesByAttribute
router.get('/', company.getCompaniesAll);
//Retrieve company by ID
router.get('/:id', company.getCompaniesById);
//Delete company by ID
router.delete('/:id', company.deleteCompaniesById);

module.exports = router;