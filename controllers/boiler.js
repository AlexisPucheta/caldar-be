const boilers = require("../data/boiler.json");

//Get all boilers
exports.getBoilersAll = (req, res) => {
  switch (Object.keys(req.query)[0]) {
    case "name":
      return res.send (boilers.filter(boiler => boiler["name"].includes(req.query.name))); 
    case "type":
      return res.send (boilers.filter(boiler => boiler["type"].$oid.includes(req.query.type)));  
    default: return res.json(boilers);
  }  
};

//Get boilers by ID
exports.getBoilerById = (req, res) => {
  const found = boilers.some(boiler => boiler._id.$oid === req.params.id);
  if (found) {
    res.json(boilers.filter(boiler => boiler._id.$oid === req.params.id));
  } else {
    res.status(400).json({ msg: `No boilers with the id of ${req.params._id}` });
  }
};

//Delete boilers
exports.deleteBoilerById = (req, res) => {
  const found = boilers.some(boiler => boiler._id.$oid === req.params.id);
  if (found) {
    res.json({msg:`Boiler with id ${req.params.id} was deleted`, boilers: boilers.filter(boiler => boiler._id.$oid !== req.params.id)});
  } else {
    res
      .status(400)
      .json({ msg: `No boilers with the _id of ${req.params._id}` });
  }
};
