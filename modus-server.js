const modbus = require('jsmodbus');
const net = require('net');

// Crear el servidor TCP de Modbus
const server = new modbus.server.TCP();

// Dirección IP y puerto para escuchar conexiones
const host = '127.0.0.1';
const port = 502; // Puerto Modbus estándar

// Configuración de registros
let registerValues = Buffer.alloc(10 * 2); // 10 registros (cada registro es de 2 bytes)
registerValues.writeUInt16BE(1234, 0); // Ejemplo de valor en el primer registro

server.on('connection', function(client) {
  console.log('Cliente conectado');
});

server.on('readHoldingRegisters', function(request, response) {
  const startAddress = request.address;
  const count = request.quantity;

  console.log(`Leyendo registros de la dirección ${startAddress} a partir de ${count} registros`);

  // Responder con los registros solicitados
  response.send(registerValues.slice(startAddress * 2, (startAddress + count) * 2));
});

server.on('writeSingleRegister', function(request, response) {
  const address = request.address;
  const value = request.value;

  console.log(`Escribiendo valor ${value} en el registro ${address}`);

  // Escribir el valor en el registro correspondiente
  registerValues.writeUInt16BE(value, address * 2);

  response.send();
});

// Crear el servidor TCP
const tcpServer = net.createServer(function(socket) {
  server.receive(socket);
});

// Iniciar el servidor TCP en el puerto especificado
tcpServer.listen(port, host, function() {
  console.log(`Servidor Modbus escuchando en ${host}:${port}`);
});
