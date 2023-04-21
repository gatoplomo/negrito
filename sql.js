// Importar la biblioteca de MySQL
const mysql = require('mysql');

// Crear una conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'plomo1994',
  database: 'WatchDog'
});


const usuario = {
  nombre: 'Plomo',
  correo:"tomas.lazo.94@gmail.com",
  contraseña: 'plomo1994'

};



// Conectar a la base de datos
connection.connect();

// Ejecutamos una consulta SQL para insertar el usuario en la tabla
connection.query('INSERT INTO usuarios SET ?', usuario, function (error, results, fields) {
  if (error) throw error;
  console.log('Usuario insertado con éxito');
});


// Cerrar la conexión con la base de datos
connection.end();