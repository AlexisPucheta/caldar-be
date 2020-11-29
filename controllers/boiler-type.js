const boilerTypes = require("../data/boiler-type.json");

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