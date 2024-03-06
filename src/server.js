const express = require('express');
const cors = require('cors');

const { PORT = 5001 } = process.env;

const app = require('./app');
const knex = require('./db/connection');

app.use(cors());
app.use(express.json()); 
 
const listener = () => console.log(`Listening on Port ${PORT}!`);

knex.migrate
    .latest()
    .then((migrations) => {
        console.log('Migrations:', migrations);
        app.listen(PORT, listener);
    })
    .catch(console.error);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
