const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '192.168.0.103';  // Dirección IP del dispositivo Awite
const port = 2080;             // Puerto para Modbus TCP (según el manual)

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los primeros 16 registros (registro 800 - 807 para status)
  client.readInputRegisters(800, 8)  // Leer 8 registros a partir de la dirección 800
    .then(function (response) {
      console.log('Registros de estado leídos:', response.response.body.values);
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer los registros de medición a partir de la dirección 808
  client.readInputRegisters(808, 56) // Leer 56 registros a partir de la dirección 808
    .then(function (response) {
      console.log('Datos de medición leídos:', response.response.body.values);
      // Aquí puedes procesar los valores de las mediciones (ej. convertir a float, si es necesario)
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
