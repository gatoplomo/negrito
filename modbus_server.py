from pymodbus.server.asyncio import ModbusTcpServer
from pymodbus.datastore import ModbusSequentialDataStore
from pymodbus.datastore import ModbusSlaveContext, ModbusContext
import asyncio

# Configuración del servidor Modbus
store = ModbusSlaveContext(
    hr=ModbusSequentialDataStore(0)  # Configura registros de tipo holding
)
context = ModbusContext(slaves=store, single=True)

# Crear y ejecutar el servidor
server = ModbusTcpServer(context, address=("0.0.0.0", 502))
loop = asyncio.get_event_loop()

print("Servidor Modbus escuchando en el puerto 502...")
loop.run_until_complete(server.serve_forever())
