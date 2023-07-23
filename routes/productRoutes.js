
const productsController = require('../controllers/productsController');
const passport = require('passport'); // validacion de peticiones con JWT


//configuracion de las rutas de comunicacion para realizar el registro de usuarios

module.exports = (app, upload) => {

    // GET-> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', {session:false}), productsController.findByCategory); //ruta para registrar el usuario

    app.get('/api/products/findByNameAndCategory/:id_category/:name', passport.authenticate('jwt', {session:false}), productsController.findByNameAndCategory); //ruta para registrar el usuario

    app.post('/api/products/create', passport.authenticate('jwt', {session:false}), upload.array('image', 3), productsController.create); //ruta para registrar el usuario
    
}