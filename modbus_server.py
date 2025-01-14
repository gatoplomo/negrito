import asyncio
from pymodbus.server import ModbusSimulatorServer

async def run():
    try:
        # Configuración del simulador Modbus
        simulator = ModbusSimulatorServer(
            modbus_server="Simulador Modbus",
            modbus_device="Dispositivo de Prueba",
            http_host="0.0.0.0",  # Escucha en todas las interfaces
            http_port=8080        # Puerto HTTP para el panel de simulación
        )
        
        print("[INFO] Iniciando el simulador Modbus...")
        
        # Ejecuta el simulador
        await simulator.run_forever(only_start=True)

        print("[INFO] Servidor Modbus corriendo en:")
        print(f"  - Dirección HTTP: http://0.0.0.0:8080")
        print(f"  - Dirección Modbus TCP: puerto 502")
        print("[INFO] Presiona CTRL+C para detener el servidor.")

        # Mantener el servidor corriendo indefinidamente
        while True:
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        print("\n[INFO] Deteniendo el servidor Modbus...")
    finally:
        await simulator.stop()
        print("[INFO] Servidor Modbus detenido.")

if __name__ == "__main__":
    # Ejecuta la función principal usando asyncio
    asyncio.run(run())
