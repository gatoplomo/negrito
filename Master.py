import pymongo
import pandas as pd

# Configurar la conexión a la base de datos MongoDB
cliente = pymongo.MongoClient('mongodb://localhost:27017/')

# Seleccionar la base de datos
db = cliente['myproject']

# Seleccionar la colección
coleccion = db['lecturas_grupo_001']

# Crear una lista para almacenar los datos de nodo1
datos_nodo1 = []

# Crear una lista para almacenar los datos de nodo2
datos_nodo2 = []

datos_nodo3 = []

documentos = coleccion.find()

for documento in documentos:
    # Obtener rtc_nodo y rtc_server
    rtc_nodo = documento['rtc_nodo']
    fecha_nodo = rtc_nodo['fecha']
    hora_nodo = rtc_nodo['hora']

    rtc_server = documento['rtc_server']
    fecha_server = rtc_server['fecha']
    hora_server = rtc_server['hora']

    # Obtener los nodos
    nodos = documento['nodos']

    for nodo in nodos:
        id_nodo = nodo['id_nodo']
        accionadores = nodo['accionadores']
        sensores = nodo['sensores']
        sensores_estado = nodo.get('sensores_estado', None)  # Obtener el campo 'sensores_estado' o asignar None si no está presente

        # Crear un diccionario para almacenar los datos del nodo
        datos_nodo = {
            'Nodo': id_nodo,
            'Fecha RTC Nodo': fecha_nodo,
            'Hora RTC Nodo': hora_nodo,
            'Fecha RTC Server': fecha_server,
            'Hora RTC Server': hora_server,
            'Accionadores': [],
            'Sensores': [],
            'Sensores Estado': sensores_estado
        }

        for accionador in accionadores:
            id_accionador = accionador['id_accionador']
            status = accionador['status']
            datos_nodo['Accionadores'].append({'ID': id_accionador, 'Status': status})
        
        for sensor in sensores:
            id_sensor = sensor['id_sensor']
            modelo = sensor['modelo']
            lecturas = sensor['lecturas']
            datos_nodo['Sensores'].append({'ID': id_sensor, 'Modelo': modelo, 'Lecturas': lecturas})

        # Agregar los datos del nodo a la lista correspondiente
        if id_nodo == 'nodo_001':
            datos_nodo1.append(datos_nodo)
        elif id_nodo == 'nodo_002':
            datos_nodo2.append(datos_nodo)
        elif id_nodo == 'nodo_003':
            datos_nodo3.append(datos_nodo)

# Crear un DataFrame de pandas para nodo1
df_nodo1 = pd.DataFrame(datos_nodo1)

# Crear un DataFrame de pandas para nodo2
df_nodo2 = pd.DataFrame(datos_nodo2)

# Crear un DataFrame de pandas para nodo2
df_nodo3 = pd.DataFrame(datos_nodo3)

# Generar los archivos de Excel para nodo1 y nodo2
df_nodo1.to_excel('/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_001/lecturas_nodo_001.xlsx', index=False)
df_nodo2.to_excel('/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_002/lecturas_nodo_002.xlsx', index=False)
df_nodo3.to_excel('/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_003/lecturas_nodo_003.xlsx', index=False)

# Cerrar la conexión
cliente.close()
