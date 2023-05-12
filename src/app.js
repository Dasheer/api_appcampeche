// Cargando módulos
const express = require('express');
const bodyParser = require('body-parser');

// Se llama a express
const app = express();
const authRoute = require("./routes/authRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargamos las rutas
app.use('api/user', authRoute);

module.exports = app;
