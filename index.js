// Declarations
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models')
//Router
const router = require('./routes');
// Database connection
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch(err => {
        console.log("Cannot connect to the database", err);
    });

//Port
const PORT = process.env.PORT || 4000;


app.use(router);

// Server listener
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

