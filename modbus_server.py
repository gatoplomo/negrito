from pymodbus.server.sync import StartTcpServer
from pymodbus.device import ModbusDeviceIdentification
from pymodbus.datastore import ModbusSequentialDataBlock
from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext

# Configuración del bloque de datos
store = ModbusSlaveContext(
    di=ModbusSequentialDataBlock(0, [0]*100),
    co=ModbusSequentialDataBlock(0, [0]*100),
    hr=ModbusSequentialDataBlock(0, [0]*100),
    ir=ModbusSequentialDataBlock(0, [0]*100))
context = ModbusServerContext(slaves=store, single=True)

# Configuración del servidor
identity = ModbusDeviceIdentification()
identity.VendorName = 'ModbusTest'
identity.ProductCode = 'MT'
identity.VendorUrl = 'http://example.com'
identity.ProductName = 'Modbus Server'
identity.ModelName = 'Modbus Server Test'
identity.MajorMinorRevision = '1.0'

# Iniciar el servidor en la IP 192.168.138.193 y puerto 502
print("Iniciando servidor Modbus en 192.168.138.193:502")
StartTcpServer(context, identity=identity, address=("192.168.138.193", 502))
