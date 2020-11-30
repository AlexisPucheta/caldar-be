const Technician = require("../models/technician");

exports.getTechniciansAll = (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);

    if(key[0] === undefined){
        Technician.find({})
        .then(data => {
            return res.send(data)
        })
    } else {
        switch (key[0]) {
            case 'full_name':
                console.log('case fullname')
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
                //Buscar otra solucion. (.populate())
            case "boilers":
                Technician.find({boilers: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length !== 0) {
                        return res.send(data);
                    }
                })
                .catch(err => {
                    if(Object.keys(err).length !== false) {
                        return res.status(400).send({msg:`Doesn't exist this boiler ID: ${reqQueryObject[key]} for any technician`});
                    } else {
                        return res.status(500).send({msg:"ERROR"});
                    }
                })
                break
            case "types":
                Technician.find({types: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length !== 0) {
                        return res.send(data);
                    }
                    })
                .catch(err => {
                    if(Object.keys(err).length !== false) {
                        return res.status(400).send({msg:`Doesn't exist this Type ID: ${reqQueryObject[key]} for any technician`});
                    } else {
                        return res.status(500).send({msg:"ERROR"});
                    }
                })
                break
            default:
                return res.status(400).send({msg:`Doesn't exist this attribute ${key[0]}`});
        }
    }
};

exports.deleteTechnicianById = (req, res) => {
    Technician.deleteOne({_id: req.params.id})
    .then(data => {
        if (data.deletedCount !== 0){
            res.send({msg: `The technician with id: ${req.params.id} was deleted successfully`});
        } else {
            res.status(400).send({msg:`Doesn't exist that technician with id: ${req.params.id}`});
        }
    })
    .catch(err => {
        res.status(500).send({msg:"ERROR"})
    })

};

exports.getTechnicianById = (req, res) => {
    Technician.findById(req.params.id)
    .then(data => {
        if (data !== null){
            res.send(data);
        } else {
            res.status(400).send({msg:`Doesn't exist that technician with id: ${req.params.id}`});
        }
    })
    .catch(err => {
        res.status(500).send({msg:"ERROR"})
    })
};