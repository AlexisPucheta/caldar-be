const technicians = require("../data/technician.json");

exports.getTechniciansAll = (req, res) => {
    for (const key in req.query) {
        if (key ==='full_name') {
            return res.json(technicians.filter(technician => technician.full_name === req.query[key]));
        } else if (key ==='phone') {
            return res.json(technicians.filter(technician => technician.phone === req.query[key]));
        } else if (key === 'birthday') {
            return res.json(technicians.filter(technician => technician.birthday === req.query[key]));
        } else if (key === 'email') {
            return res.json(technicians.filter(technician => technician.email === req.query[key]));
        } else if (key === 'boilers') {
            for (var i = 0 ; i < technicians.length; i++){
                var found = technicians[i].boilers.some(boiler => boiler.$oid === req.query[key]);
                if (found) {
                    return res.json(technicians[i]);
                }
            }
            if (!found) {
                return res.status(400).json({msg: `Don't exist that boiler: ${req.query[key]}`})
            }
        } else if (key === 'types') {
            for (var i = 0 ; i < technicians.length; i++){
                var found = technicians[i].types.some(type => type.$oid === req.query[key]);
                if (found) {
                    return res.json(technicians[i]);
                }
            }
            if (!found) {
                return res.status(404).json({msg: `Don't exist that type of boiler: ${req.query[key]}`})
            }
        }
        else if (key !== null) {
           return res.status(400).json({msg:`Dont Exist that attribute: ${key}`});
        }
      }
      res.json(technicians)
};

exports.getTechniciansById = (req, res) => {
    const found = technicians.some(technician => technician._id.$oid === req.params.id);
    if (found) {
        res.json(technicians.filter(technician => technician._id.$oid === req.params.id));
    } else {
        res.json({msg:`No Technician with id: ${req.params.id}`});
    }
};

exports.deleteTechnicianById = (req, res) => {
    const found = technicians.some(technician => technician._id.$oid === req.params.id);
    if (found) {
        res.json({msg:`Technician with id ${req.params.id} was deleted`, technicians: technicians.filter(technician => technician._id.$oid !== req.params.id)});
    } else {
        res.json({msg:`No Technician with id: ${req.params.id}`});
    }
};