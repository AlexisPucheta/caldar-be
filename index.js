// Declarations
const express = require('express');
const app = express();
//Router
const router = require('./routes');
//Port
const PORT = process.env.PORT || 4000;

app.use(router);

// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));