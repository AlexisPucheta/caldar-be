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
            case "boilers":
                Technician.find({boilers: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de types
                        return res.status(404).send({msg:`Doesn't exist this Boiler ID: ${reqQueryObject[key]} for any technician`});
                    }
                    res.send(data);
                })
                .catch(err => {
                    return res.status(500).send({msg:`Error. This is not a ID valid:${reqQueryObject[key]}`})
                })
                break
            case "types":
                Technician.find({types: reqQueryObject[key]})
                .then(data => {
                    if (Object.keys(data).length === 0 ){ //sin el lenght me devuelve vacio si le pongo un ID de boilers
                        return res.status(404).send({msg:`Doesn't exist this Type ID: ${reqQueryObject[key]} for any technician`});
                    }
                    res.send(data);
                })
                .catch(err => {
                    return res.status(500).send({msg:`Error. This is not a ID valid:${reqQueryObject[key]}`})
                })
                break
            default:
                return res.status(400).send({msg:`Doesn't exist this attribute ${key[0]}`});
        }
    }
};

exports.deleteTechnicianById = (req, res) => {
    Technician.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
    .then(data => {
        res.send({
            data, 
            msg: `Technician was deleted succesfully ${req.params.id}`
        })
    })
    .catch(err => {
        return res.status(500).send({msg:`Error removing Technician with id=${req.params.id}`})
    })

};

exports.getTechnicianById = (req, res) => {
    Technician.findById(req.params.id)
    .then(data => {
        if (!data){
            return res.status(404).send({msg:`Technician with id=${req.params.id} was no found`});
        }
        res.send(data);
    })
    .catch(err => {
        return res.status(500).send({msg:`Error searching Technician with id=${req.params.id}`})
    })
};