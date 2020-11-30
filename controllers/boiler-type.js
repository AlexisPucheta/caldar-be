const db = require('../models');
const BoilerType = db.BoilerType;

exports.getAllBoilerType = (req, res) => {
    BoilerType.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send(
                "There is some error while requesting Boiler Type"
            );
        });
};

exports.createNewBoilerType = (req, res) => {
    if (!req.body.desc) {
        res.status(400).send({ message: "There is no data to create" });
        return;
    }
    const boilerType = new BoilerType({
        desc: req.body.desc
    });
    boilerType
        .save(boilerType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "There is an error requesting in create a new boiler type"
            });
        });
};

exports.deleteBoilerTypeById = (req, res) => {
    const id = req.params._id;
    BoilerType.findOneAndDelete({ id }, { useFindAndModify: false })
        .then(data =>
            res.send({ message: "Ok in deleting" })
        )
        .catch(err => { 
            res.status(500).send({
                message: "Error deleting the existing boilertype"
            });
        });
}


/*const boilerTypes = require("../data/boiler-type.json");

exports.getBoilerTypeById = (req , res) => {
    const founded = boilerTypes.some(boilerType => {
        return boilerType._id.$oid === req.params.id;
    });
    if (founded) {
        res.json(boilerTypes.filter(boilerType => boilerType._id.$oid === req.params.id));
    } else {
        res.status(400).json({ msg: `There is no boiler type with this id: ${req.params.id}` });
    }
};

exports.deleteBoilerTypeById = (req, res) => {
    const found = boilerTypes.some(boilerType => boilerType._id.$oid === req.params.id);
    if (found) {
        res.json({msg:`Boiler-Type with id ${req.params.id} was deleted`, boilerTypes: boilerTypes.filter(boilerType => boilerType._id.$oid !== req.params.id)});
    } else {
        res.status(400).json({ msg: `There is no boiler type with this id: ${req.params.id}` });
    }
};

exports.getBoilerTypeAll = (req, res) => {
    for (const content in req.query) {
        if (content === 'desc') {
            if (boilerTypes.some(boilerType => boilerType.desc === req.query[content])) {
                return res.json(boilerTypes.filter(boilerType => boilerType.desc === req.query[content]));
            }
            else {
                return res.json({ msg: `It doesn´t exist that boiler type with this description: ${req.query[content]}`})
            }
        }
        else if (content !== null) {
            return res.json({ msg: `It doesn't exist that attribute: ${content}`});
        }
    }
    res.json(boilerTypes);
};

*/
