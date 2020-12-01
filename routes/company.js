const db = require("../models");
const Company = db.Company
var router = require("express").Router();

//Retrieve all companies
//getCompaniesAll and getCompaniesByAttribute
router.get('/', company.getCompaniesAll);
//Retrieve company by ID
router.get('/:id', company.getCompanyById);
//Delete company by ID
router.delete('/:id', company.deleteCompanyById);
/*Update company by ID
router.put('/:id', company.putCompanyById);
*/
//Create Company
router.post('/', company.create);


module.exports = router;