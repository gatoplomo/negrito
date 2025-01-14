import asyncio
from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.device import ModbusDeviceIdentification

# Configuración del servidor Modbus
def setup_server():
    # Crear un contexto de registros de esclavo vacío
    slave_context = ModbusSlaveContext(
        di=None, co=None, hr=None, ir=None
    )
    
    # Crear el contexto del servidor
    context = ModbusServerContext(slaves={1: slave_context}, single=True)
    
    # Identificación del dispositivo Modbus
    identity = ModbusDeviceIdentification(
        vendor_name="Pymodbus",
        product_code="PM",
        vendor_url="https://github.com/pymodbus-dev/pymodbus/",
        product_name="Pymodbus Server",
        model_name="Pymodbus Server",
        major_minor_revision="1.0"
    )
    
    return context, identity

# Función asincrónica para ejecutar el servidor
async def run_server():
    context, identity = setup_server()
    print("Iniciando servidor Modbus TCP en localhost:502...")
    
    # Iniciar servidor TCP asincrónico
    await StartTcpServer(context, identity=identity, address=("localhost", 502))

# Asegurarse de que el bucle de eventos de asyncio esté en ejecución
if __name__ == "__main__":
    try:
        asyncio.run(run_server())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run_server())
