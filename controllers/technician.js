const Technician = require("../models/technician");

// Create technician in the database. At least full_name is required
exports.createTechnician = (req, res) => {
    const technician = new Technician({
        full_name: req.body.full_name,
        phone: req.body.phone,
        birthday: req.body.birthday,
        email: req.body.email,
        boilers: req.body.boilers,
        types: req.body.types
    });
    if (technician.full_name !== undefined) {
        technician
            .save(technician)
            .then(data => {
                res.send({
                    data,
                    msg: 'Technician was succesfully created.'
                });
            })
            .catch(err => {
                return res.status(500).send({msg: err.message || 'Some error ocurred while creating new technician.'});
            });
    } else {
        return res.status(400).send({msg: 'Full name cannot be empty!'});
    }
};

// Retrieve all technicians or get technician by its attributes from the database.
exports.getTechniciansAll = (req, res) => {
    const key = Object.keys(req.query);
    if (JSON.stringify(req.query)==JSON.stringify({})) {
        Technician.find({})
        .then(data => {
            return res.send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving all technicians.'});
        });
    } else {
        Technician.find(req.query)
        .then(data => {
            if (Object.keys(data).length !== 0) {
                return res.send(data);
            } else {
                return res.status(404).send({msg: `Doesn't exist any technician with ${key}: ${req.query[key]}.`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || `Some error ocurred while retrieving technicians by ${key}.`});
        });
    }
};

// Retrieve technician by id from the database.
exports.getTechnicianById = (req, res) => {
    Technician.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({msg: `Doesn't exist technician with id: ${req.params.id}.`});
            }
            res.send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving technician by id.'});
        });
};

// Update technician by id in the database.
exports.updateTechnicianById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({msg: 'Data to update cannot be empty'});
    }
    if (!req.body.full_name || !req.body.phone || !req.body.birthday || !req.body.email || !req.body.boilers || !req.body.types) {
        res.status(400).send({msg: 'Content cannot be empty'});
        return;
    }

    Technician.findOneAndUpdate({_id:req.params.id}, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                return res.status(404).send({msg: `Technician with id: ${req.params.id} was no found`});
            } else {
                return res.send({
                    data,
                    msg: `Technician with id=${req.params.id} was successfully updated.`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while updating technician by id.'});
        });
};

// Delete technician by id from the database.
exports.deleteTechnicianById = (req, res) => {
    Technician.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
        .then(data => {
            res.send({
                data, 
                msg: `Technician with id: ${req.params.id} was succesfully deleted.`
            });
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while removing technician by id.'});
        });
};