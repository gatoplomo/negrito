from flask import Flask, jsonify
from pymodbus.client import ModbusTcpClient  # Cambio en la importación

app = Flask(__name__)

# Configuración del servidor Modbus TCP
MODBUS_HOST = '192.168.1.100'  # Dirección IP del dispositivo Modbus esclavo
MODBUS_PORT = 502              # Puerto por defecto para Modbus TCP

# Configurar cliente Modbus
modbus_client = ModbusTcpClient(MODBUS_HOST, port=MODBUS_PORT)

# Ruta principal
@app.route('/')
def home():
    return "Servidor Flask con Modbus Master"

# Endpoint para leer un registro Modbus (ejemplo: leer 10 registros de tipo holding)
@app.route('/api/modbus/read', methods=['GET'])
def read_modbus():
    try:
        # Conectar al servidor Modbus
        modbus_client.connect()

        # Leer 10 registros (dirección 0, cantidad de registros 10)
        result = modbus_client.read_holding_registers(0, 10)

        if result.isError():
            return jsonify({"error": "Error al leer los registros Modbus"}), 500

        # Si la lectura fue exitosa, devolver los valores
        return jsonify({"registers": result.registers})

    except Exception as e:
        return jsonify({"error": f"Error en la comunicación Modbus: {str(e)}"}), 500

    finally:
        # Cerrar la conexión Modbus
        modbus_client.close()

# Iniciar servidor Flask
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
