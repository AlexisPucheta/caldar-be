// Declarations
const express = require('express');
const app = express();
//require your controller BORRAR!
const boilerController = require("./controllers/boilers");
//Router
const router = require('./routes');
//Port
const PORT = process.env.PORT || 4000;

// API Routes BORRAR!
//app.use('/api/boiler', boilerController);
//app.use('/companies', require('./controllers/companies'));

// Require data.json BORRAR!
const boilerType = require('./data/boiler-type');

app.use(router);
// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//QUITAR TODO DE ACA HACIA ABAJO!
/*
// --------
// REST API
// --------

//---------------
// Franco Di Rosa
//---------------

// building-controller.getBuildingsAll and getBuildingsByAttribute
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

//------------------
// Federico Morabito
//------------------

// boiler-controller.getBoilerTypeById
app.get('/api/boiler/type/:id', (req, res) => {
    const founded = boilerType.some(boilerType => {
        return boilerType.id.$oid === req.params.id;
    });
    if (founded) {
        res.json(boilerType.filter(boilerType => boilerType.id.$oid === req.params.id));
    } else {
        res.status(400).json({ msg: `There is no boiler type with this id: ${req.params.id}` });
    }
});

// boiler-controller.deleteBoilerTypeById
app.delete('/api/boiler/type/:id', (req, res) => {
    const found = boilerType.some(boilerType => boilerType.id.$oid === req.params.id);
    if (found) {
        res.json(boilerType.filter(boilerType => boilerType.id.$oid === req.params.id));
    } else {
        res.status(400).json({ msg: `There is no boiler type with this id: ${req.params.id}` });
    }
});

// boiler-controller.getAllBoilerType and getBoilerTypeById
app.get('/api/boiler/type', (req, res) => {
    for (const content in req.query) {
        if (content === 'desc') {
            if (boilerType.some(boilerType => boilerType.desc === req.query[content])) {
                return res.json(boilerType.filter(boilerType => boilerType.desc === req.query[content]));
            }
            else {
                return res.json({ msg: `It doesn´t exist that boiler type with this description: ${req.query[content]}` })
            }
        }
        else if (content !== null) {
            return res.json({ msg: `It doesn't exist that attribute: ${content}` });
        }
    }
    res.json(boilerType);
});
*/