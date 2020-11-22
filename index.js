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
// getBuildingsAll
app.get('/api/building', (req, res) => res.json(buildings));
// getBuildingById
app.get('/api/building/:id', (req, res) => {
    const found = buildings.some(building => building._id.$oid === req.params.id);
    if (found) {
        res.json(buildings.filter(building => building._id.$oid === req.params.id));
    } else {
        res.status(400).json({msg: `No building with id: ${req.params.id}`});
    }
});
// getBuildingsByAttribute
app.get('/api/building?attrKey=attrValue', (req, res) => {
    res.send('Got a GET request at /api/building?attrKey=attrValue');
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