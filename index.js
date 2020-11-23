// Declarations
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const buildings = require('./data/building.json');

// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ------------------
// Building REST API
// ------------------
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