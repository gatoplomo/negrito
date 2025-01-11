from pymodbus.client import ModbusTcpClient

class ModbusClient:
    def __init__(self, host, port):
        """
        Inicializa el cliente Modbus.
        :param host: Dirección IP del servidor Modbus.
        :param port: Puerto del servidor Modbus.
        """
        self.client = ModbusTcpClient(host, port)

    def connect(self):
        """Conecta al servidor Modbus."""
        if not self.client.connect():
            raise ConnectionError("No se pudo conectar al servidor Modbus.")

    def read_registers(self, address, count, unit=1):
        """
        Lee registros holding del servidor Modbus.
        :param address: Dirección inicial de los registros.
        :param count: Cantidad de registros a leer.
        :param unit: Unidad Modbus (ID del esclavo).
        :return: Lista de registros leídos.
        """
        try:
            result = self.client.read_holding_registers(address, count, unit=unit)
            if result.isError():
                raise ValueError(f"Error al leer los registros: {result}")
            return result.registers
        except Exception as e:
            raise e
        finally:
            self.client.close()

    def close(self):
        """Cierra la conexión al servidor Modbus."""
        self.client.close()


if __name__ == "__main__":
    # Configuración del cliente
    MODBUS_HOST = "192.168.1.100"  # Cambia esto por la IP de tu servidor Modbus
    MODBUS_PORT = 502             # Puerto por defecto de Modbus TCP
    START_ADDRESS = 0             # Dirección inicial de los registros
    NUM_REGISTERS = 10            # Número de registros a leer

    # Crear y usar el cliente Modbus
    client = ModbusClient(MODBUS_HOST, MODBUS_PORT)

    try:
        # Conectar al servidor Modbus
        client.connect()
        print("Conectado al servidor Modbus.")

        # Leer registros
        registers = client.read_registers(START_ADDRESS, NUM_REGISTERS)
        print("Registros leídos:")
        for i, value in enumerate(registers):
            print(f"Registro {START_ADDRESS + i}: {value}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Cerrar la conexión
        client.close()
        print("Conexión cerrada.")
