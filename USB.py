import serial
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Configuración del puerto serie
SERIAL_PORT = 'COM5'  # Cambia esto al puerto correspondiente
BAUD_RATE = 115200    # Coincide con el baud rate del ESP8266

# Inicializar la conexión serie
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"Conectado al puerto {SERIAL_PORT}")
except Exception as e:
    print(f"Error al conectar con el puerto: {e}")
    exit()

# Variables para la gráfica
timestamps = []
voltages = []
window_size = 100  # Número de muestras visibles en la gráfica

# Configurar la figura de Matplotlib
fig, ax = plt.subplots()
line, = ax.plot([], [], lw=2)
ax.set_ylim(-0.1, 1.1)  # Ajuste de rango de voltajes
ax.set_xlim(0, 1000)    # Ajuste de rango inicial de timestamps en [us]
ax.set_xlabel("Tiempo [us]")
ax.set_ylabel("Voltaje [V]")
ax.set_title("Datos ADC")

# Función para inicializar la gráfica
def init():
    line.set_data([], [])
    return line,

# Función para actualizar la gráfica
def update(frame):
    global timestamps, voltages

    try:
        if ser.in_waiting > 0:  # Verifica si hay datos disponibles
            raw_data = ser.readline().decode('utf-8').strip()  # Leer y decodificar línea

            # Ignorar encabezados o líneas vacías
            if raw_data.startswith("START") or raw_data.startswith("END") or not raw_data:
                return line,

            # Procesar los datos delimitados por ';'
            samples = raw_data.split(';')  # Separar los pares por ';'
            for sample in samples:
                if ',' in sample:  # Buscar pares voltaje,timestamp
                    try:
                        voltage, timestamp = sample.split(',')
                        voltages.append(float(voltage))
                        timestamps.append(int(timestamp))
                    except ValueError:
                        print(f"Dato mal formado: {sample}")
                        continue  # Ignorar datos mal formados

        # Validar que las listas tengan el mismo tamaño
        if len(voltages) != len(timestamps):
            min_length = min(len(voltages), len(timestamps))
            voltages = voltages[-min_length:]
            timestamps = timestamps[-min_length:]

    except Exception as e:
        print(f"Error al leer del puerto serie: {e}")
        ser.close()
        exit()

    # Mantener el tamaño de la ventana de la gráfica
    if len(timestamps) > window_size:
        timestamps = timestamps[-window_size:]
        voltages = voltages[-window_size:]

    # Actualizar los datos de la línea
    line.set_data(timestamps, voltages)
    if len(timestamps) > 0:
        ax.set_xlim(max(0, timestamps[0]), timestamps[-1])
    return line,

# Animar la gráfica
ani = FuncAnimation(fig, update, init_func=init, blit=True, interval=50, save_count=100)

# Mostrar la gráfica
plt.show()

# Cerrar el puerto serie al finalizar
ser.close()
