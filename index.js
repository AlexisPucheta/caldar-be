//console.log('hi');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const technicians = require('./data/technician.json');

//technician-controller.getTechniciansAll and getTechniciansByAttribute
app.get('/api/technician', (req, res) => {
    for (const key in req.query) {
        if(key ==='full_name'){
            res.json(technicians.filter(technician => technician.full_name === req.query[key]));
        } else if (key ==='phone') {
            res.json(technicians.filter(technician => technician.phone === req.query[key]));
        } else if (key === 'birthday') {
            res.json(technicians.filter(technician => technician.birthday === req.query[key]));
        } else if (key === 'email') {
            res.json(technicians.filter(technician => technician.email === req.query[key]));
        } else if (key === 'boilers') {
            res.json(technicians.filter(technician => technician.boilers.$oid == req.query[key]));
        } 
        else if (key !== null){
            res.json({msg:`Dont Exist that attribute: ${key}`});
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


