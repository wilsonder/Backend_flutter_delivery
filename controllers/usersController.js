const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

// registro de usuarios controller
module.exports = {

    findDeliveryMen(req,res) {
        User.findDeliveryMen((err,data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al listar los repartidores',
                    error: err
                });
            }

            return res.status(201).json(data);

        });
    },

    login(req, res) {
        const email  = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async(err, myUser) => { //la variable data son los datos del usuario

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ //El cliente no tiene autorizacion paraa realizar esta peticion
                    success: false,
                    message: 'El email no fue encontrado',
                    
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password); //aqui comparamos la contraseña real con la encriptada


            // if para configurar el token una vez digite el usuario las credenciales de login
            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});

                //data que se le devolvera al cliente como respuesta

                const data = { 
                    id: `${myUser.id}`, //parseo a string
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles) //llamado de los roles que tien asignado cada usuario // el metdo párse elimina los caractres (/) a la hora de hacer el llamdo de la data
                }

                return res.status(201).json({
                    success: true,
                    message: 'El Usuario fue autenticado',
                    data: data // el id del nuevo usuario que se registro
                });

            }else{
                return res.status(401).json({ //El cliente no tiene autorizacion paraa realizar esta peticion
                    success: false,
                    message: 'El password es incorrecto',
                    
                }); 
            }
           
        });


    },


    //metodo register
    register(req, res) {
        const user = req.body; //capturo los datos que envia el cliente
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente',
                data: data // el id del nuevo usuario que se registro
            });
        });
    },

    //metodo register con la imagen y firebase storage para guardar las imagenes en servidor
    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user); //capturo los datos que envia el cliente por el metodo json

        const files = req.files; //constante para el llamado de los archivos los cuales van a contener las fotografias

        if (files.length > 0) {
            const path = `image_${Date.now()}`;//path -> constante con el nombre con el que se va a guardar la imagen en firebase
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;                          
            }


        }

        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            user.id = `${data}`; //registro de usuarios con el token de inicio de sesión incluido
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;


            Rol.create(user.id, 3, (err, data) => { //creacion de usuario con el rol de cliente por defecto ya que el id del rol cliente es el numero 3
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }else {
                    return res.status(201).json({
                        success: true,
                        message: 'El registro se realizó correctamente',
                        data: user // el id del nuevo usuario que se registro
                    });

                }
            }); 
           
        });
    },

    //metodo register con la imagen y firebase storage para guardar las imagenes en servidor
    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user); //capturo los datos que envia el cliente por el metodo json

        const files = req.files; //constante para el llamado de los archivos los cuales van a contener las fotografias

        if (files.length > 0) {
            const path = `image_${Date.now()}`;//path -> constante con el nombre con el que se va a guardar la imagen en firebase
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;                          
            }


        }

        User.update(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualizacion del usuario',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);
    
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData // el id del nuevo usuario que se registro
                });

            });

           

        });
    },

    //metodo register con la imagen y firebase storage para guardar las imagenes en servidor
    async updateWithoutImage(req, res) {
        const user = req.body; //capturo los datos que envia el cliente por el metodo json

        
        User.updateWithoutImage(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion del usuario',
                    error: err
                });
            }

            

            User.findById(data, (err, myData) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualizacion del usuario',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);
    
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData // el id del nuevo usuario que se registro
                });

            });


        });
    },
    
    //metodo para actualizar el token de notificaciones
    async updateNotificationToken(req, res) {
        const id = req.body.id;
        const token = req.body.token;

        
        User.updateNotificationToken(id,token, (err, id_user) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error actualizando el token de notificaciones del usuario',
                    error: err
                });
            }

            
            return res.status(201).json({
                success: true,
                message: 'El token se actualizó correctamente',
                data: id_user // el id del nuevo usuario que se registro
            });

        });
    }, 
}
