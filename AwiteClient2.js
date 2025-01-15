const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const config = {
  host: '192.168.0.103',  // Dirección IP del dispositivo Awite
  port: 2080,             // Puerto para Modbus TCP (según el manual)
  tags: {
    status: {
      startAddress: 800,
      length: 8
    },
    medicion: {
      startAddress: 808,
      length: 56,
      isFloat: true  // Indicador de que estos datos deben ser interpretados como flotantes
    }
  }
};

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Función para convertir los registros Modbus de 16 bits en un valor flotante de 32 bits
function toFloat32(registers) {
  // Combina dos registros de 16 bits en un solo número de 32 bits
  const buffer = Buffer.alloc(4);
  buffer.writeUInt16BE(registers[0], 0);  // Parte alta (registro 1)
  buffer.writeUInt16BE(registers[1], 2);  // Parte baja (registro 2)
  
  // Convierte el buffer a un valor flotante
  return buffer.readFloatBE(0);  // Leer el número flotante de 32 bits en formato Big Endian
}

// Conectar al servidor Modbus
socket.connect(config.port, config.host, () => {
  console.log(`Conectado al servidor Modbus en ${config.host}:${config.port}`);

  // Leer los primeros 16 registros (registro 800 - 807 para status)
  client.readInputRegisters(config.tags.status.startAddress, config.tags.status.length)
    .then(function (response) {
      console.log('Registros de estado leídos:', response.response.body.values);
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer los registros de medición a partir de la dirección 808
  client.readInputRegisters(config.tags.medicion.startAddress, config.tags.medicion.length)
    .then(function (response) {
      const data = response.response.body.values;

      // Procesar los registros como flotantes de 32 bits si es necesario
      let floatData = [];
      for (let i = 0; i < data.length; i += 2) {
        // Combina dos registros de 16 bits para formar un número flotante
        let floatValue = toFloat32([data[i], data[i + 1]]);
        floatData.push(floatValue);
      }

      console.log('Datos de medición leídos (como flotantes):', floatData);
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
