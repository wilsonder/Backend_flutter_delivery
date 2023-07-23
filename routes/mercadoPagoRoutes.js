
const mercadoPagoController = require('../controllers/mercadoPagoController');
const passport = require('passport'); // validacion de peticiones con JWT


//configuracion de las rutas de comunicacion para realizar el registro de usuarios

module.exports = (app) => {

    

    app.post('/api/payments/create', passport.authenticate('jwt', {session:false}), mercadoPagoController.createPayment); //ruta para registrar el usuario
    
}