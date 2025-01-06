from flask import Flask, render_template, jsonify
import paho.mqtt.client as mqtt  # Cliente MQTT
import sys
import json

# Configuración del buffering para asegurar que los prints se muestren en tiempo real
sys.stdout.reconfigure(line_buffering=True)

app = Flask(__name__, template_folder='.')

# Configuración del cliente MQTT
MQTT_BROKER = "192.168.126.193"  # Dirección del broker MQTT
MQTT_PORT = 1884  # Puerto del broker MQTT
MQTT_TOPIC = "adc/data"  # Tópico por defecto para escuchar mensajes

# Configurar cliente MQTT
mqtt_client = mqtt.Client()

# Variable para almacenar el último mensaje recibido
last_message = {"labels": [], "faseA": [], "faseB": [], "faseC": []}

# Función de conexión MQTT
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Conexión exitosa al broker MQTT {MQTT_BROKER}:{MQTT_PORT}", flush=True)
        client.subscribe(MQTT_TOPIC)  # Suscribirse al tópico
        print(f"Suscrito al tópico {MQTT_TOPIC}", flush=True)
    else:
        print(f"Error de conexión al broker MQTT. Código: {rc}", flush=True)

# Función para manejar mensajes recibidos
def on_message(client, userdata, msg):
    global last_message
    print(f"Mensaje recibido en {msg.topic}: {msg.payload.decode('utf-8')}", flush=True)
    try:
        # Procesar el mensaje recibido en el formato esperado
        mqtt_data = json.loads(msg.payload.decode('utf-8'))  # Suponiendo que el mensaje es JSON
        labels = [f"{i} ms" for i in range(len(mqtt_data["faseA"]))]
        
        # Reestructurar el mensaje en el formato deseado
        last_message = {
            "labels": labels,
            "faseA": mqtt_data["faseA"],
            "faseB": mqtt_data.get("faseB", [0] * len(mqtt_data["faseA"])),
            "faseC": mqtt_data.get("faseC", [0] * len(mqtt_data["faseA"]))
        }
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}", flush=True)

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Función para manejar desconexiones
def on_disconnect(client, userdata, rc):
    if rc != 0:
        print("Desconexión inesperada del broker MQTT.", flush=True)

mqtt_client.on_disconnect = on_disconnect

# Conectar al broker MQTT en un bloque protegido
try:
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
    print("Cliente MQTT iniciado.", flush=True)
except Exception as e:
    print(f"Error al conectar al broker MQTT: {e}", flush=True)

# Ruta principal
@app.route('/')
def home():
    return render_template('plot.html')

# Endpoint para obtener el último mensaje recibido
@app.route('/api/mqtt/last', methods=['GET'])
def get_last_message():
    try:
        return jsonify(last_message)
    except Exception as e:
        print(f"Error al obtener el último mensaje: {e}", flush=True)
        return jsonify({"error": f"Error al obtener el último mensaje: {e}"}), 500

# Iniciar servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
