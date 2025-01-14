from pymodbus.server import ModbusTcpServer
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusServerContext
import logging

# Configuración básica de logging
logging.basicConfig()
log = logging.getLogger()
log.setLevel(logging.INFO)

# Crear un bloque de datos secuenciales para los registros
store = ModbusSequentialDataBlock(0x00, [10] * 100)  # 100 registros con valor inicial 10

# Crear el contexto de servidor Modbus con el bloque de datos
context = ModbusServerContext(slaves={0x01: store}, single=True)

# Configuración del servidor
identity = ModbusDeviceIdentification()
identity.VendorName = "Pymodbus"
identity.ProductCode = "PM"
identity.ProductName = "Modbus Server"
identity.ModelName = "Modbus Server Model"

# Iniciar el servidor en el puerto 502
server = ModbusTcpServer(context, identity=identity, address=("localhost", 502))

# Iniciar el servidor
log.info("Starting Modbus server...")
server.serve_forever()
