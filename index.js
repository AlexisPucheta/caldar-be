//console.log('hi');

const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const technicians = require('./data/technician.json');