const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (ESP32)
const host = '192.168.0.102';  // Dirección IP del dispositivo ESP32
const port = 502;              // Puerto estándar para Modbus TCP

// Crea un socket TCP
const socket = new net.Socket();

// Crea un cliente Modbus TCP
const client = new modbus.client.TCP(socket, 1);  // Asegúrate de que el ID de unidad (unitId) sea correcto

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los primeros 8 registros (modificar si es necesario)
  client.readInputRegisters(0, 8)  // Intentamos leer desde la dirección 0, 8 registros
    .then(function (response) {
      console.log('Registros de estado leídos:', response.response.body.values);
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer registros de medición (modificar dirección de inicio y cantidad si es necesario)
  client.readInputRegisters(10, 10) // Intentamos leer desde la dirección 10, 10 registros
    .then(function (response) {
      let data = response.response.body.values;

      // Convertir los registros a flotantes dividiendo entre 10
      let floatData = data.map(val => val / 10);

      console.log('Datos de medición leídos (convertidos a flotantes):', floatData);
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
