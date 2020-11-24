/*Se debe crear un archivo con el nombre del recurso y extensión js, guardándolo dentro de la carpeta “controllers”, 
y se debe crear la lógica de negocio para:
Obtener todos los recursos (Ej: getAllBuildings)
Obtener un recurso por un campo específico. (Ej: getBuildingsByCategory)
Obtener un recurso por id. (Ej: getBuildingById)
Borrar un recurso de la lista y sobreescribir el archivo JSON para actualizarlo.*/

const express = require("express");
const router = express.Router();
const boilers = require("../data/boilers.json");

const idFilter = (req) => (boiler) => boiler._id.$oid === (req.params._id);

//Get all boilers
router.get("/", (req, res) => {
  
  
  switch (Object.keys(req.query)[0]) {
    case "name":
      return res.send (boilers.filter(boiler => boiler["name"].includes(req.query.name))); 
    case "type":
      return res.send (boilers.filter(boiler => boiler["type"].$oid.includes(req.query.type)));  
    default: return res.json(boilers);
  }  
});

//Get boilers by ID
router.get("/:_id", (req, res) => {
  const found = boilers.some(idFilter(req));

  if (found) {
    res.json(boilers.filter(idFilter(req)));
  } else {
    res.status(4000).json({ msg: `No boilers with the id of ${req.params._id}` });
  }
});

//Delete boilers
router.delete("/:_id", (req, res) => {
  const found = boilers.some(idFilter(req));

  if (found) {
    res.json({
      msg: "Boilers deleted",
      boilers: boilers.filter((boiler) => !idFilter(req)(boiler)),
    });
  } else {
    res
      .status(4000)
      .json({ msg: `No boilers with the _id of ${req.params._id}` });
  }
});

module.exports = router;
