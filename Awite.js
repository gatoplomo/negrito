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

// Conectar al servidor Modbus
socket.connect(port, host, () => {
  console.log(`Conectado al servidor Modbus en ${host}:${port}`);

  // Leer los registros de medición a partir de la dirección 808
  client.readInputRegisters(808, 56) // Leer 56 registros a partir de la dirección 808
    .then(function (response) {
      console.log('Datos de medición leídos:');

      // Asumimos que los valores relevantes están en estos índices
      let values = response.response.body.values;

      // Crear el objeto JSON con tags y valores
      let data = {
        "CH4": parseValue(values[3]),  // CH4 en el índice 3
        "O2": parseValue(values[4]),   // O2 en el índice 4
        "CO2": parseValue(values[0]),  // CO2 en el índice 0
        "H2": parseValue(values[13]),  // H2 en el índice 13
        "H2S": parseValue(values[5])   // H2S en el índice 5
      };

      console.log(JSON.stringify(data, null, 2));  // Mostrar el JSON generado

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
