const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const dbConnect = require("./config/dbConnect");

const app = express();
const dotenv = require('dotenv').config();

const authRoute = require("./routes/authRoute");
const {notFound, errorHandler} = require("./middlewares/errorHandler");

const cookie = require('cookie-parser');

app.use(cors());
// Se define el puerto
const PORT = process.env.PORT || 3000;

// Se conecta a la base de datos
dbConnect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookie());

// Cargamos las rutas
app.use('/api/v1', authRoute);

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.use(notFound);
app.use(errorHandler);

// Escuchamos el puerto
app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`);
})
