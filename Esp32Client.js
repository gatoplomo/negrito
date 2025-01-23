const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '192.168.0.102';  // Dirección IP del dispositivo Awite
const port = 502;              // Puerto para Modbus TCP (según el manual)

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Probar con direcciones y registros más bajos (ejemplo: dirección 100, leer 4 registros)
  client.readInputRegisters(100, 4)  // Leer 4 registros a partir de la dirección 100
    .then(function (response) {
      let data = response.response.body.values;
      let floatData = data.map(val => val / 10); // Convertir a flotante
      console.log('Registros de estado leídos (convertidos a flotantes):', floatData);
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer registros de medición a partir de la dirección 200 (ejemplo, con 4 registros)
  client.readInputRegisters(200, 4) // Leer 4 registros a partir de la dirección 200
    .then(function (response) {
      let data = response.response.body.values;
      let floatData = data.map(val => val / 10); // Convertir a flotante
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
