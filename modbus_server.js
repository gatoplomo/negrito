const modbus = require('jsmodbus');
const net = require('net');

// Crear un servidor TCP de net
const netServer = new net.Server();

// Crear el servidor Modbus usando el servidor TCP
const server = new modbus.server.TCP(netServer);

// Configuración del servidor TCP
netServer.listen(502, () => {
  console.log('Servidor Modbus escuchando en el puerto 502');
});

// Manejar la conexión de clientes Modbus
server.on('connection', function(client) {
  console.log('Cliente Modbus conectado');
});

// Simulación de un registro
let registerValues = Buffer.alloc(10 * 2); // 10 registros de 2 bytes
registerValues.writeUInt16BE(1234, 0); // Ejemplo de valor en el primer registro

// Leer registros
server.on('readHoldingRegisters', function(request, response) {
  const startAddress = request.address;
  const count = request.quantity;

  console.log(`Leyendo ${count} registros desde la dirección ${startAddress}`);

  // Responder con los registros solicitados
  response.send(registerValues.slice(startAddress * 2, (startAddress + count) * 2));
});

// Escribir un solo registro
server.on('writeSingleRegister', function(request, response) {
  const address = request.address;
  const value = request.value;

  console.log(`Escribiendo valor ${value} en el registro ${address}`);

  // Escribir el valor en el registro correspondiente
  registerValues.writeUInt16BE(value, address * 2);

  response.send();
});
