const BoilerType = require("../models/boiler-type")

//Create a boiler type. At least desc is required
exports.create = (req, res) => {
    const boilerType = new BoilerType({
        desc: req.body.desc
    });
    if (boilerType.desc !== undefined) {
        boilerType
            .save(boilerType)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                return res.send.status(500)({ msg: "Something went wrong!" });
            })
    } else {
        return res.send({ msg: `Desc cannot be empty` });
    }
};

//get all boiler type or get boiler type by his attributes
exports.getBoilerTypeAll = (req, res) => {
    const key = Object.keys(req.query);
    if (JSON.stringify(req.query) == JSON.stringify({})) {
        BoilerType.find({})
            .then(data => {
                return res.status(200).send(data);
            })
            .catch(err => {
                return res.status(500).send({ msg: err.message || 'Some error ocurred while retrieving all Boiler types.' });
            });
    } else {
        BoilerType.find(req.query)
            .then(data => {
                if (Object.keys(data).length !== 0) {
                    return res.status(200).send(data);
                } else {
                    return res.status(404).send({ msg: `Doesn't exist any Boiler type with ${key}: ${req.query[key]}.` });
                }
            })
            .catch(err => {
                return res.status(500).send({ msg: err.message || `Some error ocurred while retrieving Boiler types by ${key}.` });
            });
    }
};

//Delete boiler type by id from db
exports.deleteBoilerTypeById = (req, res) => {
    BoilerType.findOneAndDelete({ _id: req.params.id }, { useFindAndModify: false })
        .then(data => {
            res.send({
                data,
                msg: `Boiler type was deleted succesfully ${req.params.id}`
            });
        })
        .catch(err => {
            return res.status(500).send({
                msg: `Error removing Boiler type with id= $(req.params.id)`
            })
        });
};

// get boilertype by id
exports.getBoilerTypeById = (req, res) => {
    BoilerType.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({ msg: `Boiler type with id=${req.params.id} was no found` });
            }
            res.send(data);
        })
        .catch(err => {
            return res.status(500).send({ msg: `Error searching Boiler type with id=${req.params.id}` });
        })
};

//Update boiler type by id. All register are needed.
exports.putBoilerType = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'The data is empty so it cannot be updated'
        });
    }
    if (!req.body.desc) {
        res.status(400).send({ msg: 'Content cannot be empty' });
        return;
    }
    BoilerType.findOneAndUpdate({ _id: req.params.id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    msg: `Boiler type with id=${req.params.id} was not found`
                });
            } else res.status(200).send({ data, msg: `Boiler type with id=${req.params.id} was update successfully` });
        })
        .catch(err => {
            return res.status(500).send({ msg: `ERROR updating Boiler type with id: ${req.params.id}` });
        });
};

