const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const boilerType = require('./data/boiler-type');

// Controller getBoilerTypeById
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

// Controller deleteBoilerTypeById
app.delete('/api/boiler/type/:id', (req, res) => {
    const found = boilerType.some(boilerType => boilerType.id.$oid === req.params.id);
    if (found) {
        res.json(boilerType.filter(boilerType => boilerType.id.$oid === req.params.id));
    } else {
        res.status(400).json({ msg: `There is no boiler type with this id: ${req.params.id}` });
    }
});

//Controller getAllBoilerType and getBoilerTypeById
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
