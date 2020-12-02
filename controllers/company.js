const Company = require ("../models/company");

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

//company-controller.getAllCompanies or getCompaniesByAttribute
exports.getCompaniesAll = (req, res) => {
    const key = Object.keys(req.query);
    if (JSON.stringify(req.query)==JSON.stringify({})) {
        Company.find({})
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || "Some error ocurred while requesting all companies"});
        });
    }   else {
            Company.find(req.query)
            .then(data => {
                if (Object.keys(data).length !==0) {
                    return res.status(200).send(data);
                } else {
                    return res.status(404).send({msg:`Doesn't exist any company with ${key}: ${req.query[key]}.`});
                }
            })
            .catch(err => {
                return res.status(500).send({msg: err.message || `Some error ocurred while retrieving companies by ${key}`});
            })
        }
};

//company-controller.getCompanyById
exports.getCompanyById = (req, res) => {
    Company.findById({_id: req.params.id})
    .then(data => {
        if (!data) {
            return res.status(404).send({
                message: `Company with id ${req.params.id} was not found`
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

//company-controller.updateCompanyById
exports.updateCompanyById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({msg: `Data to update cannot be empty`});
    }
    if (!req.body.name || !req.body.buildings) {
        return res.status(400).send({msg:`Content cannot be empty`});
    }

    Company.findByIdAndUpdate({_id: req.params.id}, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                return res.status(404).send({msg:`Company with id ${req.params.id}was not found`});
            }   else {
                return res.status(200).send({msg:`Company with id ${req.params.id}was updated`})
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || "Some error ocurred while updating company by id"})
        })
};

//company-controller.deleteCompaniesById
exports.deleteCompanyById = (req, res) => {
    Company.findByIdAndRemove({_id: req.params.id}, {useFindAndModify: false})
    .then(data => {
        res.status(200).send({
            data,
            msg:`Company with id: ${req.params.id}was deleted.`
        });
    })
    .catch(err => {
        return res.status(500).send({msg: err.message || "Some error curred while removing company by id"})
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

//company-controller.getAllCompany
/*exports.getCompaniesAll = (req, res) => {
    Company.find({})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send(
            "There is some error while requesting Companies"
        );
    });
};*/