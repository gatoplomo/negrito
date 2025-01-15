const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus
const host = '192.168.0.101';  // Dirección del servidor Modbus
const port = 502;              // Puerto del servidor Modbus

// Crear el socket manualmente
const socket = new net.Socket();

// Crear el cliente Modbus
const client = new modbus.client.TCP(socket);

// Conectar al servidor Modbus
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
