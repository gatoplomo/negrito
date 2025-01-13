from pymodbus.server.asyncio import ModbusTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusContext
from pymodbus.datastore import ModbusSequentialDataStore
import asyncio

# Configuración de los registros (holding registers)
store = ModbusSlaveContext(
    hr=ModbusSequentialDataStore(0)  # Configura registros tipo holding
)
context = ModbusContext(slaves=store, single=True)

# Crear y ejecutar el servidor
server = ModbusTcpServer(context, address=("0.0.0.0", 502))

# Crear el bucle asyncio y ejecutar el servidor
loop = asyncio.get_event_loop()
print("Servidor Modbus TCP iniciado en el puerto 502...")
loop.run_until_complete(server.serve_forever())
