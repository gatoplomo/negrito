from pymongo import MongoClient
from datetime import datetime
import json

# Establecer la conexión con MongoDB
client = MongoClient('mongodb://192.168.207.193:27017/')

# Obtener la fecha actual en formato "año-mes-dia"
fecha_actual = datetime.now().strftime('%Y-%m-%d')

# Seleccionar la base de datos
db = client['myproject']

# Nombre de la colección
nombre_coleccion = 'lecturas_grupo_001'

# Seleccionar la colección
collection = db[nombre_coleccion]

# Crear el filtro de búsqueda
filtro = {'rtc_server.fecha': fecha_actual}

# Obtener los documentos que cumplen con el filtro
documentos = collection.find(filtro)

# Obtener las keys de las lecturas de cada sensor
keys_lecturas = []
for documento in documentos:
    nodos = documento['nodos']
    for nodo in nodos:
        id_grupo = documento['grupo']
        id_nodo = nodo['id_nodo']
        sensores = nodo['sensores']
        for sensor in sensores:
            id_sensor = sensor['id_sensor']
            modelo_sensor = sensor['modelo']
            lecturas = sensor['lecturas']
            hora_rtc = documento['rtc_server']['hora']  # Actualizar la hora para cada lectura
            for key, value in lecturas.items():
                id_variable = f"{id_grupo}/{id_nodo}/{id_sensor}/{modelo_sensor}/{key}"
                variable_encontrada = False

                # Verificar si la id_variable coincide con alguna de las IDs construidas anteriormente
                for objeto in keys_lecturas:
                    if objeto['id_variable'] == id_variable:
                        objeto['lecturas'].append({'hora': hora_rtc, 'dato': value})
                        variable_encontrada = True
                        break

                if not variable_encontrada:
                    variable_objeto = {"id_variable": id_variable, "lecturas": [{'hora': hora_rtc, 'dato': value}]}
                    keys_lecturas.append(variable_objeto)

# Imprimir los objetos de las variables
variables_array = []
for variable_objeto in keys_lecturas:
    variables_array.append(variable_objeto)

# Imprimir el array de objetos
#print(variables_array)


granularity = 'hora'  # Cambiar a 'hora' para filtrar por hora

processed_array = []

for variable in variables_array:
    id_variable = variable['id_variable']
    lecturas = variable['lecturas']
    
    # Diccionario para almacenar las lecturas filtradas
    lecturas_filtradas = {}
    
    for lectura in lecturas:
        hora = lectura['hora']
        dato = lectura['dato']
        
        # Convierte la cadena de hora en un objeto datetime
        hora_dt = datetime.strptime(hora, '%H:%M:%S')
        
        # Filtrar por minuto
        if granularity == 'minuto':
            # Obtiene la hora y el minuto sin segundos
            hora_granularidad = hora_dt.strftime('%H:%M')
            
        # Filtrar por hora
        elif granularity == 'hora':
            # Obtiene solo la hora sin minutos ni segundos
            hora_granularidad = hora_dt.strftime('%H')
        
        # Verifica si ya se ha registrado una lectura para esta hora/granularidad
        if hora_granularidad not in lecturas_filtradas:
            lecturas_filtradas[hora_granularidad] = dato
    
    # Crea una nueva entrada para el objeto con las lecturas filtradas
    processed_obj = {
        'id_variable': id_variable,
        'lecturas': [{'hora': hora_granularidad, 'dato': lectura} for hora_granularidad, lectura in lecturas_filtradas.items()]
    }
    processed_array.append(processed_obj)
    json_data = json.dumps(processed_array)
    
print(json_data)
# Cerrar la conexión con MongoDB
client.close()
