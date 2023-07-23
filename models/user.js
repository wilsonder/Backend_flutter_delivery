const db = require('../config/config');
const bcrypt = require('bcryptjs'); //paquete para encriptar las contraseñas

const User = {};

User.findById = (id,result) => { //Buscar usuario por id

    const sql = `
    SELECT CONVERT(U.id, char) AS id,U.email,U.name,U.lastname,U.phone,U.image,U.password,U.notification_token,
    JSON_ARRAYAGG(JSON_OBJECT( 
      'id', CONVERT(R.id, CHAR),
      'name', R.name,
      'image', R.image,
      'route', R.route
      )
  ) AS roles
   FROM users AS U 
      INNER JOIN user_has_roles AS UHR ON UHR.id_user = U.id
      INNER  JOIN roles AS R ON UHR.id_rol  = R.id
      WHERE U.id = ?
      GROUP BY U.id
        `;

    db.query (
        sql,
        [id],

        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                console.log('Usuario obtenido: ', user[0]);
                result(null, user[0]);
            }
        }

    )
}


User.findDeliveryMen = (result) => { //Listar todos los usuarios que tengan el rol de repartidor
    const sql = `
    SELECT 
        CONVERT(U.id, char) AS id ,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone
    FROM 
	    users AS U
    INNER JOIN 
	    user_has_roles AS UHR
    ON
	    UHR.id_user = U.id
    INNER JOIN
	    roles AS R
    ON 
	    R.id = UHR.id_rol
    WHERE 
	    R.id = 2;
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                result(null, data);
            }
        }
    )
}

User.findAdmins = (result) => { //Listar todos los usuarios que tengan el rol de repartidor
    const sql = `
    SELECT
	CONVERT(U.id, char) AS id,
    U.notification_token,
    U.name
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON 
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 1
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                result(null, data);
            }
        }
    )
}



User.findByEmail = (email,result) => { //Buscar usuario por email

    const sql = `
    SELECT U.id,U.email,U.name,U.lastname,U.phone,U.image,U.password,
    JSON_ARRAYAGG(JSON_OBJECT( 
      'id', CONVERT(R.id, char),
      'name', R.name,
      'image', R.image,
      'route', R.route
      )
  ) AS roles
   FROM users AS U 
      INNER JOIN user_has_roles AS UHR ON UHR.id_user = U.id
      INNER  JOIN roles AS R ON UHR.id_rol  = R.id
      WHERE email = ?
      GROUP BY U.id
        `;

    db.query (
        sql,
        [email],

        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                console.log('Usuario obtenido: ', user[0]);
                result(null, user[0]);
            }
        }

    )
}


//configuracion del insert a la tabla usuarios
User.create = async (user, result) => {
    const hash = await bcrypt.hash(user.password, 10) // contraseña encriptada
    const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;
    //llamado de los campos para hacer el insert
    db.query
    (
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(), // este parametro es para el campo created_at y updated_at
            new Date(),
        ],
        //captura de errores

        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                console.log('Id del nuevo usuario: ', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

User.update = (user, result) => {

    const sql = `
    UPDATE
        users
    SET
        name  = ?,
        lastname = ?,
        phone = ?,
        image = ?,
        updated_at = ?

    WHERE 
        id = ?

    `;

    /* llamado de campos para hacer el update de los datos */

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(), // este parametro es para el campo  updated_at para la fecha de actualizacion
            user.id
        ],
        //captura de errores

        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                console.log('Usuario Actualizado', user.id);
                result(null, user.id);
            }
        }
    )
}



User.updateWithoutImage = (user, result) => {

    const sql = `
    UPDATE
        users
    SET
        name  = ?,
        lastname = ?,
        phone = ?,
        updated_at = ?

    WHERE 
        id = ?

    `;

    /* llamado de campos para hacer el update de los datos */

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            new Date(), // este parametro es para el campo  updated_at para la fecha de actualizacion
            user.id
        ],
        //captura de errores

        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                console.log('Usuario Actualizado', user.id);
                result(null, user.id);
            }
        }
    )
}


User.updateNotificationToken = (id,token, result) => {

    const sql = `
    UPDATE
        users
    SET
        notification_token  = ?,
        updated_at = ?

    WHERE 
        id = ?

    `;

    /* llamado de campos para hacer el update de los datos */

    db.query
    (
        sql,
        [
            token,
            new Date(), // este parametro es para el campo  updated_at para la fecha de actualizacion
            id
            
        ],
        //captura de errores

        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }else{
                result(null, id);
            }
        }
    )
}


module.exports = User; //exportar el archivo user.js para usarlo en otros archivos