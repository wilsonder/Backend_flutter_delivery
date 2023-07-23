
const OrdersController = require('../controllers/ordersController');
const passport = require('passport'); // validacion de peticiones con JWT


//configuracion de las rutas de comunicacion para realizar el registro de usuarios

module.exports = (app) => {

    // GET-> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS


    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', {session:false}), OrdersController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', {session:false}), OrdersController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', {session:false}), OrdersController.findByClientAndStatus);

    app.post('/api/orders/create', passport.authenticate('jwt', {session:false}), OrdersController.create); //ruta para registrar el usuario

    app.put('/api/orders/updateToDispatched', passport.authenticate('jwt', {session:false}), OrdersController.updateToDispatched); //ruta actualizar la orden a despachado
    app.put('/api/orders/updateToOnTheWay', passport.authenticate('jwt', {session:false}), OrdersController.updateToOnTheWay); //ruta para actualizar la orden a en CAMINO
    app.put('/api/orders/updateToDelivered', passport.authenticate('jwt', {session:false}), OrdersController.updateToDelivered); //ruta para actualizar la orden a ENTREGADO
    app.put('/api/orders/updateLatLng', passport.authenticate('jwt', {session:false}), OrdersController.updateLatLng); //ruta para guardar la latitud y la longitud de nuestra posicion 
}