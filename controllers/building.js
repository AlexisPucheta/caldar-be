const Building = require("../models/building.js");

// Create building in the database. At least name is required
exports.createBuilding = (req, res) => {
    const building = new Building({
        name: req.body.name,
        address: req.body.address,
        boilers: req.body.boilers,
        company: req.body.company
    });
    if (building.name !== undefined) {
        building
            .save(building)
            .then(data => {
                res.status(200).send({
                    data, 
                    msg: 'Building was succesfully created.'
                });
            })
            .catch(err => {
                return res.status(500).send({msg: err.message || 'Some error ocurred while creating new building.'});
            });
    } else {
        return res.status(400).send({msg: 'Name cannot be empty!'});
    }
};

// Retrieve all buildings or get building by its attributes from the database.
exports.getBuildingsAll = (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);

    if (key[0] === undefined) {
        Building.find({})
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving all buildings.'});
        });
    } else {
        switch (key[0]) {
            case 'name':
                Building.find({name: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length !== 0) {
                        return res.status(200).send(data);
                    } else {
                        return res.status(404).send({msg: `Doesn't exist any building with ${key}: ${reqQueryObject[key]}.`});
                    }
                })
                .catch(err => {
                    return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving building.'});
                });
                break;
            case 'address':
                Building.find({address: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length !== 0) {
                        return res.status(200).send(data);
                    } else {
                        return res.status(404).send({msg: `Doesn't exist any building with ${key}: ${reqQueryObject[key]}.`});
                    }
                })
                .catch(err => {
                    return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving building.'});
                });
                break;
            case 'boilers':
                Building.find({boilers: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de boilers
                        return res.status(404).send({msg: `Doesn't exist this boiler id: ${reqQueryObject[key]} for any building.`});
                    }
                    res.status(200).send(data);
                })
                .catch(err => {
                    return res.status(500).send({msg:`Error. This is not a ID valid:${reqQueryObject[key]}`});
                })
                break;
            case 'company':
                Building.find({company: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de company
                        return res.status(404).send({msg: `Doesn't exist building belonging to ${key} with id: ${reqQueryObject[key]}.`});
                    }
                    res.status(200).send(data);
                })
                .catch(err => {
                    return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving building.'});
                });
                break;
            default:
                return res.status(400).send({msg: `Doesn't exist attribute ${key[0]}.`});
        }
    }
};

//Retrieve building by id from the database.
exports.getBuildingById = (req, res) => {
    Building.findById(req.params.id)
    .then(data => {
        if (!data) {
            return res.status(404).send({msg: `Doesn't exist building with id: ${req.params.id}.`});
        }
        res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving building by id.'});
    });
};

// Update building by id in the database.
exports.updateBuildingById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({msg: `Data to update cannot be empty!`});
    }
    if (!req.body.name || !req.body.address || !req.body.boilers || !req.body.company) {
        return res.status(400).send({msg:`Content cannot be empty!`});
    }

    Building.findOneAndUpdate({_id: req.params.id}, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                return res.status(404).send({msg:`Building with id: ${req.params.id} was not found.`});
            } else {
                return res.status(200).send({msg:`Building with id: ${req.params.id} was successfully updated.`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while updating building by id.'})
        })
};

// Delete building by id from the database.
exports.deleteBuildingById = (req, res) => {
    Building.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
    .then(data => {
        res.status(200).send({
            data, 
            msg: `Building with id: ${req.params.id} was succesfully deleted.`
        });
    })
    .catch(err => {
        return res.status(500).send({msg: err.message || 'Some error ocurred while removing building by id.'})
    });
};