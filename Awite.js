const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '192.168.0.103';  // Dirección IP del dispositivo Awite
const port = 502;              // Puerto para Modbus TCP

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Función para identificar si un dato es flotante o entero
function parseValue(value) {
  if (value % 10 === 0) {
    // Si el valor es múltiplo de 10, probablemente es un entero
    return value / 10; // Escala el valor para convertirlo en flotante (por ejemplo, 813 -> 81.3)
  } else {
    // De lo contrario, lo tratamos como un valor entero normal
    return value;
  }
}

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los primeros 16 registros (registro 800 - 807 para estado)
  client.readInputRegisters(800, 8)  // Leer 8 registros a partir de la dirección 800
    .then(function (response) {
      console.log('Registros de estado leídos:');
      response.response.body.values.forEach(value => {
        console.log(parseValue(value));  // Llamamos a la función para identificar si es flotante o entero
      });
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer los registros de medición a partir de la dirección 808
  client.readInputRegisters(808, 56) // Leer 56 registros a partir de la dirección 808
    .then(function (response) {
      console.log('Datos de medición leídos:');
      response.response.body.values.forEach(value => {
        console.log(parseValue(value));  // Llamamos a la función para procesar los valores
      });
    })
    .catch(function (err) {
      console.error('Error al leer datos de medición:', err);
    });
});

// Manejo de errores de conexión
socket.on('error', (err) => {
  console.error('Error en la conexión:', err);
});

// Manejo de la desconexión
socket.on('close', () => {
  console.log('Conexión cerrada');
});
