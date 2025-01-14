import asyncio
from pymodbus.server.async_io import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock, ModbusSlaveContext, ModbusServerContext

# Configuración del datastore (almacenamiento de registros Modbus)
store = ModbusSlaveContext(
    di=ModbusSequentialDataBlock(0, [0] * 100),  # Discrete Inputs
    co=ModbusSequentialDataBlock(0, [0] * 100),  # Coils
    hr=ModbusSequentialDataBlock(0, [0] * 100),  # Holding Registers
    ir=ModbusSequentialDataBlock(0, [0] * 100),  # Input Registers
)
context = ModbusServerContext(slaves=store, single=True)

# Información del servidor
identity = ModbusDeviceIdentification()
identity.VendorName = "pymodbus"
identity.ProductCode = "PM"
identity.VendorUrl = "http://github.com/riptideio/pymodbus/"
identity.ProductName = "pymodbus Server"
identity.ModelName = "pymodbus Server"
identity.MajorMinorRevision = "3.8.3"

# Función principal para iniciar el servidor
async def run_server():
    print("Iniciando el servidor Modbus...")
    await StartTcpServer(context, identity=identity, address=("0.0.0.0", 502))

if __name__ == "__main__":
    asyncio.run(run_server())
