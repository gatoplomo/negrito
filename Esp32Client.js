const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (ESP32 o dispositivo Modbus)
const host = '192.168.0.102'; // Cambia esta IP a la de tu dispositivo
const port = 502; // Puerto estándar para Modbus TCP

// Crear el socket TCP
const socket = new net.Socket();
const client = new modbus.client.TCP(socket, 1); // 1 es el ID de la unidad Modbus, cámbialo si es diferente

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer 8 registros desde la dirección 800 (puedes ajustar esta dirección)
  client.readInputRegisters(800, 8)  // Lee 8 registros desde la dirección 800
    .then(function (response) {
      let data = response.response.body.values;
      let floatData = data.map(val => val / 10); // Convertir los valores a flotante (dividiendo por 10)
      console.log('Registros de estado leídos (convertidos a flotantes):', floatData);
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer registros de medición a partir de la dirección 808
  client.readInputRegisters(808, 56) // Lee 56 registros desde la dirección 808
    .then(function (response) {
      let data = response.response.body.values;
      let floatData = data.map(val => val / 10); // Convertir los valores a flotante (dividiendo por 10)
      console.log('Datos de medición leídos (convertidos a flotantes):', floatData);
    })
    .catch(function (err) {
      console.error('Error al leer registros de medición:', err);
    });
});

// Manejo de errores
socket.on('error', (err) => {
  console.error('Error en la conexión:', err);
});

// Manejo de cierre de conexión
socket.on('close', () => {
  console.log('Conexión cerrada');
});