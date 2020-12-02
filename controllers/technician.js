const Technician = require("../models/technician");

//Create a technician. At least full_name is required
exports.createTechnician = (req, res) => {
    const technician = new Technician({
        full_name: req.body.full_name,
        phone: req.body.phone,
        birthday: req.body.birthday,
        email: req.body.email,
        boilers: req.body.boilers,
        types: req.body.types
    });
    if (technician.full_name !== undefined){
        technician
            .save(technician)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                return res.send.status(500)({msg:"Something went wrong!"});
            })
    } else {
        return res.send({msg:`Full_name cannot be empty`});
    }
};

// get all technician or get technician by his attributes
exports.getTechniciansAll = (req, res) => {
    const key = Object.keys(req.query);
    if (JSON.stringify(req.query)==JSON.stringify({})) {
        Technician.find({})
        .then(data => {
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || 'Some error ocurred while retrieving all Technicians.'});
        });
    } else {
        Technician.find(req.query)
        .then(data => {
            if (Object.keys(data).length !== 0) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send({msg: `Doesn't exist any Technician with ${key}: ${req.query[key]}.`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg: err.message || `Some error ocurred while retrieving Technicians by ${key}.`});
        });
    }
};

//get technician by id
exports.getTechnicianById = (req, res) => {
    Technician.findById(req.params.id)
        .then(data => {
            if (!data){
                return res.status(404).send({msg:`Technician with id=${req.params.id} was no found`});
            }
            res.send(data);
        })
        .catch(err => {
            return res.status(500).send({msg:`Error searching Technician with id=${req.params.id}`});
        })
};

//Update technician by id. All register are needed. (PUT)
exports.updateTechnicianById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({msg: `Data to update cannot be empty`});
    }
    //console.log(req.body)
    if (!req.body.full_name || !req.body.phone || !req.body.birthday || !req.body.email || !req.body.boilers || !req.body.types) {
        res.status(400).send({msg:`Content cannot be empty`});
        return;
    }

    Technician.findOneAndUpdate({_id:req.params.id}, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                return res.status(404).send({msg:`Technician with id=${req.params.id} was no found`});
            } else {
                return res.status(200).send({data, msg:`Technician with id=${req.params.id} was update successfully`});
            }
        })
        .catch(err => {
            return res.status(500).send({msg:`ERROR updating Technician with id: ${req.params.id}`});
        })
};

//Delete technician by id from db
exports.deleteTechnicianById = (req, res) => {
    Technician.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
        .then(data => {
            res.send({
                data, 
                msg: `Technician was deleted succesfully ${req.params.id}`
            });
        })
        .catch(err => {
            return res.status(500).send({msg:`Error removing Technician with id=${req.params.id}`})
        })

};