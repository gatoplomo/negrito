const modbus = require('jsmodbus');
const net = require('net');

// Configura la conexión con el servidor Modbus
const client = new modbus.client.TCP();

// Dirección IP y puerto del servidor Modbus
const host = '127.0.0.1';  // Dirección del servidor
const port = 502;          // Puerto del servidor

// Conectar al servidor Modbus
const socket = new net.Socket();
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Lee los primeros 2 registros (ejemplo)
  client.readHoldingRegisters(0, 2) // Dirección 0, leer 2 registros
    .then(function (response) {
      console.log('Registros leídos:', response.response.body.values);
    })
    .catch(function (err) {
      console.error('Error al leer registros:', err);
    });

  // Escribe un solo registro
  client.writeSingleRegister(0, 5678) // Escribir 5678 en la dirección 0
    .then(function (response) {
      console.log('Registro escrito correctamente');
    })
    .catch(function (err) {
      console.error('Error al escribir registro:', err);
    });
});

// Maneja errores de conexión
socket.on('error', (err) => {
  console.error('Error en la conexión:', err);
});

// Maneja la desconexión
socket.on('close', () => {
  console.log('Conexión cerrada');
});