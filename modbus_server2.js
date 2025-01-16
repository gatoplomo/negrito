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
server.on('connection', function (client) {
  console.log('Cliente Modbus conectado');
});

// Simulación de un registro
// Extiende el tamaño del buffer para soportar 256 direcciones (o más) de holding registers
let registerValues = Buffer.alloc(512); // 256 registros de 2 bytes cada uno
registerValues.writeUInt16BE(1234, 0);  // Valor inicial de prueba en el registro 0

// Leer registros
server.on('readHoldingRegisters', function (request, response) {
  const startAddress = request.address;
  const count = request.quantity;

  console.log(`Leyendo ${count} registros desde la dirección ${startAddress}`);

  // Validar si la solicitud está dentro del rango permitido
  if ((startAddress + count) * 2 > registerValues.length) {
    console.error('Solicitud de lectura fuera de rango');
    return response.exception(3); // Código de excepción 3: Illegal Data Address
  }

  // Responder con los registros solicitados
  response.send(registerValues.slice(startAddress * 2, (startAddress + count) * 2));
});

// Escribir un solo registro
server.on('writeSingleRegister', function (request, response) {
  const address = request.address;
  const value = request.value;

  console.log(`Escribiendo valor ${value} en el registro ${address}`);

  // Validar si la dirección está dentro del rango permitido
  if (address * 2 >= registerValues.length) {
    console.error('Dirección de escritura fuera de rango');
    return response.exception(3); // Código de excepción 3: Illegal Data Address
  }

  // Escribir el valor en el registro correspondiente
  registerValues.writeUInt16BE(value, address * 2);

  response.send();
});

// Escribir múltiples registros (para cumplir con las solicitudes del cliente)
server.on('writeMultipleRegisters', function (request, response) {
  const startAddress = request.address;
  const values = request.values; // Valores a escribir como un buffer

  console.log(
    `Escribiendo múltiples registros desde la dirección ${startAddress}, cantidad: ${values.length / 2}`
  );

  // Validar si la solicitud está dentro del rango permitido
  if ((startAddress * 2 + values.length) > registerValues.length) {
    console.error('Solicitud de escritura fuera de rango');
    return response.exception(3); // Código de excepción 3: Illegal Data Address
  }

  // Escribir los valores en el buffer
  values.copy(registerValues, startAddress * 2);

  response.send();
});
