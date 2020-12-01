const db = require ('../models');
const Company = db.Company;

//company-controller.create
exports.createCompany = (req, res) => {
    //Validate request
    if (!req.body.name || !req.body.buildings) {
        res.status(400).send( {message: "There is no data to create"});
        return;
    }
    //Create company
    const company = new Company ({
        name: req.body.name,
        buildings: req.body.buildings
    });
    //Save company
    company
        .save(company)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "There is an error creating a new company"
            });
        });
};

//company-controller.getAllCompany
exports.getCompaniesAll = (req, res) => {
    Company.find({})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send(
            "There is some error while requesting Companies"
        );
    });
};

//company-controller.getCompanyById
exports.getCompanyById = (req, res) => {
    Company.findById({_id: req.params.id})
    .then(data => {
        if (!data) {
            return res.status(404).send({
                message: 'Company with id ${req.params.id} was not found'
            })
        }
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error ocurred while requesting data"
        });
    });
};



//company-controller.getAllCompanies
/*exports.getCompaniesAll = (req, res) => {
    for (const key in req.query) {
        if (key ==='buildings') {
            for (let i = 0 ; i < companies.length; i++){
                var found = companies[i].buildings.some(building => building.$oid === req.query[key]);
                if (found) {
                    return res.json(companies[i]);
                }
            }
            if (!found) {
                return res.status(400).json({msg: `Doesn't exist that company: ${req.query[key]}`})
            }
        } else if (key ==='name') {
            return res.json(companies.filter(companies => companies.name === req.query[key]));
        }
    }
    res.json(companies);
};
*/
//company-controller.getCompaniesById
/*exports.getCompanyById = (req, res) =>  {
    const found = companies.some(company => company._id.$oid === req.params.id);
    if (found) {
        res.json(companies.filter(company => company._id.$oid === req.params.id));
    } else {
        res.status(400).json({msg: "No company with id: ${req.params.id}"});
    }
};*/
/* company-controller.deleteCompaniesById */

exports.deleteCompanyById = (req, res) => {
    const found = companies.some(company => company._id.$oid === req.params.id);
    if (found) {
        res.json({msg:`Company with id ${req.params.id} was deleted`, companies: companies.filter(company => company._id.$oid !== req.params.id)});
    } else {
        res.status(400).json({msg: `No company with id: ${req.params.id}`});
    }
};

