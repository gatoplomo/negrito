const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '10.31.213.114';  // Dirección IP del dispositivo Awite
const port = 502;              // Puerto para Modbus TCP (según el manual)

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los primeros 68 Holding Registers (índices 0 al 67)
  client.readHoldingRegisters(0, 68)  // Leer 68 registros desde la dirección 0
    .then(function (response) {
      let registers = response.response.body.values;

      // Mostrar valores en formato hexadecimal
      console.log("\nValores de Holding Registers (Hexadecimal):");
      console.log("Índice     Hexadecimal");
      console.log("-".repeat(20));
      registers.forEach((reg, idx) => {
        // Alineación manual para los valores
        console.log(`${idx.toString().padEnd(10)} 0x${reg.toString(16).toUpperCase().padStart(4, '0')}`);
      });

      // Traducir y mostrar a caracteres ASCII (Big Endian)
      console.log("\nTraducción a ASCII (Big Endian):");
      console.log("Índice     Hexadecimal   ASCII");
      console.log("-".repeat(30));
      registers.forEach((reg, idx) => {
        // Obtener los bytes alto y bajo (Big Endian)
        let highByte = (reg >> 8) & 0xFF;
        let lowByte = reg & 0xFF;

        // Convertir a caracteres ASCII, reemplazar caracteres no imprimibles
        let asciiHigh = (highByte >= 32 && highByte <= 126) ? String.fromCharCode(highByte) : '.';
        let asciiLow = (lowByte >= 32 && lowByte <= 126) ? String.fromCharCode(lowByte) : '.';
        let asciiChars = `${asciiHigh}${asciiLow}`;

        // Alineación manual para los valores
        console.log(`${idx.toString().padEnd(10)} 0x${reg.toString(16).toUpperCase().padStart(4, '0')} ${asciiChars.padEnd(10)}`);
      });
    })
    .catch(function (err) {
      console.error('Error al leer registros:', err);
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
