const Boiler = require("../models/boiler.js");

// Create boiler in the database. At least name is required
exports.createBoiler = (req, res) => {
    const boiler = new Boiler({
        name: req.body.name,
        type: req.body.type
    });
    if (boiler.name !== undefined) {
        boiler
            .save(boiler)
            .then(data => {
                res.status(200).send({
                    data, 
                    msg: 'Boiler was succesfully created.'
                });
            })
            .catch(err => {
                return res.status(500).send({msg: err.message || 'Some error ocurred while creating new boiler.'});
            });
    } else {
        return res.status(400).send({msg: 'Name cannot be empty!'});
    }
};

// Retrieve all boilers or get boiler by its attributes from the database.
exports.getBoilersAll = (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);

    if (key[0] === undefined) {
        Boiler.find({})
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving all boilers.'});
        });
    } else {
        switch (key[0]) {
            case 'name':
                Boiler.find({name: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length !== 0) {
                        return res.status(200).send(data);
                    } else {
                        return res.status(404).send({msg: `Doesn't exist any boiler with ${key}: ${reqQueryObject[key]}.`});
                    }
                })
                .catch(err => {
                    return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving boiler.'});
                });
                break;
            case 'type':
                Boiler.find({company: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de type
                        return res.status(404).send({msg: `Doesn't exist boiler ${key} with id: ${reqQueryObject[key]}.`});
                    }
                    res.status(200).send(data);
                })
                .catch(err => {
                    return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving boiler.'});
                });
                break;
            default:
                return res.status(400).send({msg: `Doesn't exist attribute ${key[0]}.`});
        }
    }
};

//Retrieve boiler by id from the database.
exports.getBoilerById = (req, res) => {
    Boiler.findById(req.params.id)
    .then(data => {
        if (!data) {
            return res.status(404).send({msg: `Doesn't exist boiler with id: ${req.params.id}.`});
        }
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving boiler by id.'});
    });
};

// Update boiler by id in the database.
exports.updateBoilerById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({msg: `Data to update cannot be empty!`});
    }
    if (!req.body.name || !req.body.type) {
        return res.status(400).send({msg:`Content cannot be empty!`});
    }

    Boiler.findOneAndUpdate({_id: req.params.id}, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                return res.status(404).send({msg:`Boiler with id: ${req.params.id} was not found.`});
            } else {
                return res.status(200).send({msg:`Boiler with id: ${req.params.id} was successfully updated.`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while updating boiler by id.'})
        })
};

// Delete boiler by id from the database.
exports.deleteBoilerById = (req, res) => {
    Boiler.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
    .then(data => {
        res.status(200).send({
            data, 
            msg: `Boiler with id: ${req.params.id} was succesfully deleted.`
        });
    })
    .catch(err => {
        return res.status(500).send({msg: err.message || 'Some error ocurred while removing boiler by id.'})
    });
};