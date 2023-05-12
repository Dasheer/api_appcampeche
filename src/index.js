const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require("./config/dbConnect");

const app = express();
const dotenv = require('dotenv').config();

const authRoute = require("./routes/authRoute");

// Se define el puerto
const port = 3000;

// Se conecta a la base de datos
dbConnect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargamos las rutas
app.use('/api/user', authRoute);

// Escuchamos el puerto
app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
})
