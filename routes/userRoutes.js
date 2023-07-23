
const usersController = require('../controllers/usersController');
const passport = require('passport'); // validacion de peticiones con JWT


//configuracion de las rutas de comunicacion para realizar el registro de usuarios

module.exports = (app, upload) => {

    // GET-> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', {session:false}) ,usersController.findDeliveryMen);
    app.post('/api/users/create', usersController.register); //ruta para registrar el usuario
    app.post('/api/users/createWithImage', upload.array('image',1), usersController.registerWithImage); //ruta para el cargue de las imagenes
    app.post('/api/users/login', usersController.login);     //ruta para el inicio de sesion

    app.put('/api/users/update', passport.authenticate('jwt', {session:false}), upload.array('image',1) ,usersController.updateWithImage);     //ruta para la actualizacion de datos del usuario con imagen
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session:false}),  usersController.updateWithoutImage);  //ruta para la actualizacion de datos del usuario sin imagen
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', {session:false}),  usersController.updateNotificationToken); //ruta para actualizar el token de notificaciones del usuario

}