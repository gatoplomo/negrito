import asyncio
from pymodbus.server import StartTcpServer
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
from pymodbus.device import ModbusDeviceIdentification

# Crear un contexto de servidor y un dispositivo
def setup_server():
    # Contexto para los registros de esclavo
    slave_context = ModbusSlaveContext(
        di=None, co=None, hr=None, ir=None
    )
    
    # Crear contexto del servidor con un único esclavo
    context = ModbusServerContext(slaves={1: slave_context}, single=True)
    
    # Información de identificación del dispositivo
    identity = ModbusDeviceIdentification(
        vendor_name="Pymodbus",
        product_code="PM",
        vendor_url="https://github.com/pymodbus-dev/pymodbus/",
        product_name="Pymodbus Server",
        model_name="Pymodbus Server",
        major_minor_revision="1.0"
    )
    
    return context, identity

# Iniciar el servidor Modbus TCP asincrónico
async def run_server():
    context, identity = setup_server()
    server = StartTcpServer(context, identity=identity, address=("localhost", 502))
    print("Iniciando servidor Modbus TCP en localhost:502...")
    
    # Ejecutar el servidor asincrónicamente
    await server.serve_forever()

# Asegurarnos de que el bucle de eventos de asyncio esté iniciado
if __name__ == "__main__":
    try:
        asyncio.run(run_server())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run_server())
