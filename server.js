
//declaracion de variables para la creacion del servidor
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const io = require('socket.io')(server);
const mercadopago = require('mercadopago');

mercadopago.configure({

    sandbox: true,
    access_token: 'TEST-4330441164488302-021417-785e47772ab0bdf0255013da7cdbc89f-1310491091'
});


/* 

    IMPORTAR SOCKETS

*/

const ordersSockets = require('./sockets/ordersSocket');



/* 

 IMPORTAR RUTAS

*/

const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoute');
const ordersRoutes = require('./routes/orderRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');

//configuracion del puerto por el cual se va comunicar el servidor

const port = process.env.PORT || 3000;

//captura de errores y configuracion de la forma en que se muestren los errores en pantalla
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');
app.set('port', port);


//llamado de los sockets de comunicacion

ordersSockets(io);


//llamado de la libreria multer para el cargue de las imagenes
const upload = multer({
    storage: multer.memoryStorage()

});

//llamado de las rutas

usersRoutes(app, upload);
categoriesRoutes(app);
productRoutes(app,upload);
addressRoutes(app);
ordersRoutes(app);
mercadoPagoRoutes(app);

//ip por la cual se va comunicar el puerto y a su vez la aplicacion

server.listen(3000, '192.168.1.15' || 'localhost', function() {  //ip del computador ipconfiip

     //mensaje en  pantalla si la aplicacion se inicio de manera correcta 
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
}); 

//creacion y configuracin de la primera ruta de comunicacion para probar con postamn o el navegador
app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

app.get('/test', (req, res) => {
    res.send('Este es la ruta test');
});


//manejo de errores

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// 200 - significa es una respuesta exitosa
// 404 - significa la url no existe
// 500 - error interno del servidor


