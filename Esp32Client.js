const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '10.31.213.114';  // Dirección IP del dispositivo Awite
const port = 502;              // Puerto para Modbus TCP (según el manual)

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Función para leer los registros en lotes
function readRegistersInBatches(startAddress, totalRegisters, batchSize) {
  return new Promise((resolve, reject) => {
    let registers = [];
    let batchStart = startAddress;

    async function readNextBatch() {
      while (batchStart < startAddress + totalRegisters) {
        const currentBatchSize = Math.min(batchSize, startAddress + totalRegisters - batchStart);
        console.log(`Leyendo registros desde ${batchStart} a ${batchStart + currentBatchSize - 1} (Total: ${currentBatchSize})`);

        try {
          const response = await client.readHoldingRegisters(batchStart, currentBatchSize);
          if (response && response.response) {
            registers = registers.concat(response.response.body.values);
            console.log(`Éxito: Leídos ${currentBatchSize} registros.`);
          } else {
            console.error(`Error al leer registros desde ${batchStart} a ${batchStart + currentBatchSize - 1}`);
          }
        } catch (err) {
          console.error(`Excepción al leer registros desde ${batchStart} a ${batchStart + currentBatchSize - 1}:`, err);
        }
        batchStart += currentBatchSize;
      }

      resolve(registers);
    }

    readNextBatch();
  });
}

// Conectar al servidor Modbus
socket.connect(port, host, async () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los registros en lotes (por defecto, 10 registros por lote)
  const START_ADDRESS = 0;
  const TOTAL_REGISTERS = 68;  // Leer registros desde la dirección 0 hasta 67
  const BATCH_SIZE = 10;       // Tamaño del lote de lectura

  try {
    const registers = await readRegistersInBatches(START_ADDRESS, TOTAL_REGISTERS, BATCH_SIZE);

    // Mostrar valores en formato hexadecimal
    console.log("\nValores de Holding Registers (Hexadecimal):");
    console.log("Índice     Hexadecimal");
    console.log("-".repeat(20));
    registers.forEach((reg, idx) => {
      console.log(`${idx.toString().padEnd(10)} 0x${reg.toString(16).toUpperCase().padStart(4, '0')}`);
    });

    // Traducir y mostrar a caracteres ASCII (Big Endian)
    console.log("\nTraducción a ASCII (Big Endian por registro):");
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

      console.log(`${idx.toString().padEnd(10)} 0x${reg.toString(16).toUpperCase().padStart(4, '0')} ${asciiChars.padEnd(10)}`);
    });

    // Reconstruir la cadena completa (Big Endian: byte alto primero)
    let bytesList = [];
    registers.forEach((reg) => {
      let highByte = (reg >> 8) & 0xFF;
      let lowByte = reg & 0xFF;
      bytesList.push(highByte, lowByte);
    });

    // Convertir la lista de bytes a un objeto Buffer
    const buffer = Buffer.from(bytesList);

    // Decodificar la cadena completa a JSON
    try {
      const jsonString = buffer.toString('ascii').replace(/\x00/g, '');  // Eliminar caracteres nulos
      console.log("\nJSON Decodificado:");
      console.log(jsonString);

      // Validar y formatear el JSON
      try {
        const parsedJson = JSON.parse(jsonString);
        console.log("\nJSON Validado Correctamente:");
        console.log(JSON.stringify(parsedJson, null, 4));
      } catch (e) {
        console.error("Error al validar el JSON:", e);
      }
    } catch (e) {
      console.error("Error al decodificar el JSON:", e);
    }

  } catch (err) {
    console.error('Error al leer los registros:', err);
  }
});

// Manejo de errores de conexión
socket.on('error', (err) => {
  console.error('Error en la conexión:', err);
});

// Manejo de la desconexión
socket.on('close', () => {
  console.log('Conexión cerrada');
});
