from pymodbus.client import ModbusTcpClient


class ModbusClient:
    def __init__(self, host, port=502):
        """
        Inicializa el cliente Modbus.
        :param host: Dirección IP del servidor Modbus.
        :param port: Puerto del servidor Modbus (por defecto 502).
        """
        self.client = ModbusTcpClient(host=host, port=port)

    def connect(self):
        """Conecta al servidor Modbus."""
        if not self.client.connect():
            raise ConnectionError(f"No se pudo conectar al servidor Modbus en {self.client.host}:{self.client.port}.")

    def read_registers(self, address, count, unit=1):
        """
        Lee registros holding del servidor Modbus.
        :param address: Dirección inicial de los registros.
        :param count: Cantidad de registros a leer.
        :param unit: Unidad Modbus (ID del esclavo).
        :return: Lista de registros leídos.
        """
        if not self.client.is_socket_open():
            raise ConnectionError("La conexión al servidor Modbus no está activa.")
        
        try:
            result = self.client.read_holding_registers(address, count, unit=unit)
            if result.isError():
                raise ValueError(f"Error al leer los registros: {result}")
            return result.registers
        except Exception as e:
            raise e

    def close(self):
        """Cierra la conexión al servidor Modbus."""
        if self.client.is_socket_open():
            self.client.close()

    def __del__(self):
        """Destructor: Asegura que la conexión se cierre al eliminar el objeto."""
        self.close()


if __name__ == "__main__":
    # Configuración del cliente
    MODBUS_HOST = "192.168.1.100"  # Cambia esto por la IP de tu servidor Modbus
    MODBUS_PORT = 502             # Puerto por defecto de Modbus TCP
    START_ADDRESS = 0             # Dirección inicial de los registros
    NUM_REGISTERS = 10            # Número de registros a leer

    # Crear y usar el cliente Modbus
    client = ModbusClient(MODBUS_HOST, MODBUS_PORT)

    try:
        print("Conectando al servidor Modbus...")
        client.connect()
        print("Conexión exitosa.")

        print(f"Leyendo {NUM_REGISTERS} registros desde la dirección {START_ADDRESS}...")
        registers = client.read_registers(START_ADDRESS, NUM_REGISTERS)
        print("Registros leídos:")
        for i, value in enumerate(registers):
            print(f"Registro {START_ADDRESS + i}: {value}")
    except ConnectionError as ce:
        print(f"Error de conexión: {ce}")
    except ValueError as ve:
        print(f"Error en los registros: {ve}")
    except Exception as e:
        print(f"Error inesperado: {e}")
    finally:
        # Cerrar la conexión
        client.close()
        print("Conexión cerrada.")
