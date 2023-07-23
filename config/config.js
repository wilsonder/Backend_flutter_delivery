const mysql = require ('mysql');

//conexion a laa base de datos mysql

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'flutter_delivery',    
});

//verficar si la conexion fue exitosa o de lo contrario que nos muestre error

db.connect(function(err) {
    if(err) throw err;
    console.log('BASE DE DATOS CONECTADA!');
});

module.exports = db;