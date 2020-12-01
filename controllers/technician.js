const Technician = require("../models/technician");

// get all technician or get technician by his attributes
exports.getTechniciansAll = (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);

    if(key[0] === undefined){
        Technician.find({})
            .then(data => {
                return res.send(data);
            })
    } else {
        switch (key[0]) {
            case 'full_name':
                Technician.find({full_name: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length !== 0) {
                            return res.send(data);
                        } else {
                            return res.status(400).send({msg:`Doesn't exist that technician with a full_name: ${reqQueryObject[key]}`});
                        }
                    })
                    .catch(err => {
                        return res.status(500).send({msg:"ERROR"});
                    })
                break;
            case 'phone':
                Technician.find({phone: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length !== 0) {
                            return res.send(data);
                        } else {
                            return res.status(400).send({msg:`Doesn't exist this phone number ${reqQueryObject[key]} for any technician`});
                        }
                    })
                    .catch(err => {
                        return res.status(500).send({msg:"ERROR"});
                    })
                break;
            case 'birthday':
                Technician.find({birthday: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length !== 0) {
                            return res.send(data);
                        } else {
                            return res.status(400).send({msg:`Doesn't exist this birthday ${reqQueryObject[key]} for any technician`});
                        }
                    })
                    .catch(err => {
                        return res.status(500).send({msg:"ERROR"});
                    })
                break;
            case 'email':
                Technician.find({email: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length !== 0) {
                            return res.send(data);
                        } else {
                            return res.status(400).send({msg:`Doesn't exist this email ${reqQueryObject[key]} for any technician`});
                        }
                    })
                    .catch(err => {
                        return res.status(500).send({msg:"ERROR"});
                    })
                break;
            case "boilers":
                Technician.find({boilers: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de types
                            return res.status(404).send({msg:`Doesn't exist this Boiler ID: ${reqQueryObject[key]} for any technician`});
                        }
                        res.send(data);
                    })
                    .catch(err => {
                        return res.status(500).send({msg:`Error. This is not a ID valid:${reqQueryObject[key]}`});
                    })
                break;
            case "types":
                Technician.find({types: reqQueryObject[key]})
                    .then(data => {
                        if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de boilers
                            return res.status(404).send({msg:`Doesn't exist this Type ID: ${reqQueryObject[key]} for any technician`});
                        }
                        res.send(data);
                    })
                    .catch(err => {
                        return res.status(500).send({msg:`Error. This is not a ID valid:${reqQueryObject[key]}`});
                    })
                break;
            default:
                return res.status(400).send({msg:`Doesn't exist this attribute ${key[0]}`});
        }
    }
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
exports.putTechnicianById = (req, res) => {
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

//Create a technician. At least full_name is required
exports.create = (req, res) => {
    const technician = new Technician({
        full_name: req.body.full_name,
        phone: req.body.phone,
        birthday: req.body.birthday,
        email: req.body.email,
        boilers: req.body.boilers,
        types: req.body.types
    });
    if (technician.full_name !==undefined){
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


