const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.use('/companies', require('./controllers/companies'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));




