//console.log('hi');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const technicians = require('./data/technician.json');

app.use(express.json());
//technician-controller.getTechniciansAll and getTechniciansByAttribute
app.get('/api/technician', (req, res) => {
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
                return res.json({msg: `Don't exist that boiler: ${req.query[key]}`})
            }
        } else if (key === 'types') {
            for (var i = 0 ; i < technicians.length; i++){
                var found = technicians[i].types.some(type => type.$oid === req.query[key]);
                if (found) {
                    return res.json(technicians[i]);
                }
            }
            if (!found) {
                return res.json({msg: `Don't exist that boiler: ${req.query[key]}`})
            }
        }
        else if (key !== null) {
           return res.json({msg:`Dont Exist that attribute: ${key}`});
        }
      }
      res.json(technicians)
});

//technician-controller.getTechnicianById
app.get('/api/technician/:id', (req, res) => {
    const found = technicians.some(technician => technician._id.$oid === req.params.id);
    if (found) {
        res.json(technicians.filter(technician => technician._id.$oid === req.params.id));
    } else {
        res.json({msg:`No Technician with id: ${req.params.id}`});
    }
});

//technician-controller.deleteTechnicianById
app.delete('/api/technician/:id', (req, res) => {
    const found = technicians.some(technician => technician._id.$oid === req.params.id);
    if (found) {
        res.json({msg:`Technician with id ${req.params.id} was deleted`, technicians: technicians.filter(technician => technician._id.$oid !== req.params.id)});
    } else {
        res.json({msg:`No Technician with id: ${req.params.id}`});
    }
});


