
const categoriesController = require('../controllers/categoriesController');
const passport = require('passport'); // validacion de peticiones con JWT


//configuracion de las rutas de comunicacion para realizar el registro de usuarios

module.exports = (app) => {

    // GET-> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS


    app.get('/api/categories/getAll', passport.authenticate('jwt', {session:false}), categoriesController.getAll); 

    app.post('/api/categories/create', passport.authenticate('jwt', {session:false}), categoriesController.create); //ruta para registrar el usuario
    
}