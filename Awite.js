const modbus = require('jsmodbus');
const net = require('net');

// Dirección IP y puerto del servidor Modbus (Awite)
const host = '192.168.0.103';  // Dirección IP del dispositivo Awite
const port = 502;              // Puerto para Modbus TCP

const socket = new net.Socket();
const client = new modbus.client.TCP(socket);

// Función para detectar y corregir valores flotantes escalados
function parseValue(value) {
  // Verificar si el valor parece ser un flotante escalado
  if (value > 100 && value < 1000) {
    // Suposición: valores como 29 se refieren a 2.9, por ejemplo
    return value / 10;
  } else if (value > 10000) {
    // Valores muy grandes pueden ser enteros
    return value;  // Tratamos este caso como un entero directo
  } else {
    // Si no se aplica ninguna regla, dejamos el valor como está
    return value;
  }
}

// Imprimir para confirmar que estamos en el script correcto
console.log('Script Modbus iniciado...');


// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los primeros 16 registros (registro 800 - 807 para estado)
  client.readInputRegisters(800, 8)  // Leer 8 registros a partir de la dirección 800
    .then(function (response) {
      console.log('Registros de estado leídos:');
      response.response.body.values.forEach(value => {
        console.log(parseValue(value));  // Llamamos a la función para identificar si es flotante o entero
      });
    })
    .catch(function (err) {
      console.error('Error al leer registros de estado:', err);
    });

  // Leer los registros de medición a partir de la dirección 808
  client.readInputRegisters(808, 56) // Leer 56 registros a partir de la dirección 808
    .then(function (response) {
      console.log('Datos de medición leídos:');
      response.response.body.values.forEach(value => {
        console.log(parseValue(value));  // Llamamos a la función para procesar los valores
      });
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
