if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'hbs');

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${ process.env.PORT }`);
});