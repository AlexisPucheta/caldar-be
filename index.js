// Declarations
const express = require('express');
const app = express();
const boilerController = require("./controllers/boilers");

// Boilers API Routes
app.use('/api/boiler', boilerController);
const PORT = process.env.PORT || 4000;
app.use('/companies', require('./controllers/companies'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//Require data.json
const buildings = require('./data/building.json');
const technicians = require('./data/technician.json');

// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ------------------
// Building REST API
// ------------------

//Franco Di Rosa
// getBuildingsAll - getBuildingsByAttribute
app.get('/api/building', (req, res) => {
    const reqQueryObject = req.query;
    const key = Object.keys(reqQueryObject);

    if (JSON.stringify(reqQueryObject)==JSON.stringify({})) {
        res.json(buildings)
    } else {
        switch (key[0]) {
            case '_id':
                if (buildings.some(building => building._id.$oid === reqQueryObject[key])) {
                    return res.json(buildings.filter(building => building._id.$oid === reqQueryObject[key]));
                } else {
                    return res.status(400).json({msg: `No building with ${key}: ${reqQueryObject[key]}`});
                }
            case 'name':
                if (buildings.some(building => building.name === reqQueryObject[key])) {
                    return res.json(buildings.filter(building => building.name === reqQueryObject[key]));
                } else {
                    return res.status(400).json({msg: `No building with ${key}: ${reqQueryObject[key]}`});
                }
            case 'address':
                if (buildings.some(building => building.address === reqQueryObject[key])) {
                    return res.json(buildings.filter(building => building.address === reqQueryObject[key]));
                } else {
                    return res.status(400).json({msg: `No building with ${key}: ${reqQueryObject[key]}`});
                }
            case 'boilers':
                for (var i = 0 ; i < buildings.length; i++) {
                    var found = buildings[i].boilers.some(boiler => boiler.$oid === reqQueryObject[key]);
                    if (found) {
                        return res.json(buildings[i]);
                    }
                }
                if (!found) {
                    return res.status(400).json({msg: `No building with ${key}: ${reqQueryObject[key]}`});
                }
            case 'company':
                if (buildings.some(building => building.company.$oid === reqQueryObject[key])) {
                    return res.json(buildings.filter(building => building.company.$oid === reqQueryObject[key]));
                } else {
                    return res.status(400).json({msg: `No building with ${key}: ${reqQueryObject[key]}`});
                }
            default:
                return res.status(400).json({msg: `Invalid attribute: ${key}`});
        }
    }
});
// getBuildingById
app.get('/api/building/:id', (req, res) => {
    const found = buildings.some(building => building._id.$oid === req.params.id);
    if (found) {
        res.json(buildings.filter(building => building._id.$oid === req.params.id));
    } else {
        res.status(400).json({msg: `No building with id: ${req.params.id}`});
    }
});
// deleteBuildingById
app.delete('/api/building/:id', (req, res) => {
    const found = buildings.some(building => building._id.$oid === req.params.id);
    if (found) {
        res.json(buildings.filter(building => building._id.$oid === req.params.id));
    } else {
        res.status(400).json({msg: `No building with id: ${req.params.id}`});
    }
});

//--------------------
//Alexis Pucheta
//--------------------

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
//------------------------------------------
