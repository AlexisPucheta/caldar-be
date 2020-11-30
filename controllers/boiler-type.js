const db = require('../models');
const BoilerType = db.BoilerType;

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
    const id = req.params.id;
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

exports.getBoilerTypeAll = (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);
    if (key[0] === undefined) {
        BoilerType.find({})
            .then(data => {
                return res.send(data)
            })
    } else {
        switch (key[0]) {
            case 'desc':
                console.log('case desc')
                BoilerType.find({ desc: reqQueryObject[key] })
                    .then(data => {
                        if (Object.keys(data).length !== 0) {
                            return res.send(data);
                        } else {
                            return res.status(400).send({ msg: `Doesn't exist that boiler type with that desc: ${reqQueryObject[key]}` });
                        }
                    })
                    .catch(err => {
                        return res.status(500).send({ msg: "There is some error when requesting that description" });
                    })
        }
    }
};

exports.updateBoilerType = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "The data is empty so it cannot be updated"
        });
    }
    if (!req.body.desc) {
        res.status(400).send({
            message: "The content cannot be empty"
        });
        const id = req.params._id;
        BoilerType.findOneAndRemove({ id }, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: "Update failed because that id doesn't exist."
                    });
                } else res.send({ message: "Boiler type was succesfully updated." });
            })
            .catch(err => {
                res.status(500).send({
                    message: "Update failed"
                });
            });
    };
};