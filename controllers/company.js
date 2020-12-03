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

