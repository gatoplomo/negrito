import pandas as pd
import json

# Ruta al archivo de Excel
ruta_excel = "/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_003/lecturas_nodo_003.xlsx"

# Leer el archivo de Excel y seleccionar la hoja de trabajo
df = pd.read_excel(ruta_excel)

# Obtener los datos de las columnas "Accionadores", "Fecha RTC Nodo", "Hora RTC Nodo", "Fecha RTC Server" y "Hora RTC Server"
accionadores = df["Accionadores"]
fecha_rtc_nodo = df["Fecha RTC Nodo"]
hora_rtc_nodo = df["Hora RTC Nodo"]
fecha_rtc_server = df["Fecha RTC Server"]
hora_rtc_server = df["Hora RTC Server"]

# Crear un diccionario para almacenar los datos de los accionadores
accionadores_data = {}

# Procesar los datos de la columna "Accionadores"
for accionador in accionadores:
    accionador_json = json.loads(accionador.replace("'", "\""))  # Reemplazar comillas simples por comillas dobles
    for item in accionador_json:
        accionador_id = item["ID"]
        accionador_status = item["Status"]
        if accionador_id not in accionadores_data:
            accionadores_data[accionador_id] = []
        accionadores_data[accionador_id].append(accionador_status)

# Crear un dataframe con los datos de los accionadores
df_accionadores = pd.DataFrame(accionadores_data)

# Renombrar las columnas con el formato "accionador_001" y "accionador_002"
df_accionadores = df_accionadores.rename(columns={column: f"accionador_{column.split('_')[-1]}" for column in df_accionadores.columns})

# Agregar las columnas "Fecha RTC Nodo", "Hora RTC Nodo", "Fecha RTC Server" y "Hora RTC Server" al dataframe de los accionadores
df_accionadores.insert(0, "Fecha RTC Nodo", fecha_rtc_nodo)
df_accionadores.insert(1, "Hora RTC Nodo", hora_rtc_nodo)
df_accionadores.insert(2, "Fecha RTC Server", fecha_rtc_server)
df_accionadores.insert(3, "Hora RTC Server", hora_rtc_server)

# Guardar el DataFrame en un archivo Excel
nombre_excel = "/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_003/accionadores_nodo_003.xlsx"
df_accionadores.to_excel(nombre_excel, index=False)
print(f"Archivo Excel '{nombre_excel}' generado exitosamente.")



# Obtener la primera fila del DataFrame
primera_fila = df.iloc[0]

# Obtener los datos de la primera casilla de la columna "Sensores"
sensores_primera_fila = eval(primera_fila["Sensores"])

# Crear un conjunto para almacenar los modelos de sensor únicos
modelos_unicos = set()

# Crear un diccionario para almacenar las variables de cada modelo de sensor
variables_sensores = {}

# Obtener los modelos de sensor únicos presentes en la primera fila y sus variables correspondientes
for sensor in sensores_primera_fila:
    modelo = sensor["Modelo"]
    modelos_unicos.add(modelo)
    
    # Obtener las variables del sensor y agregarlas al diccionario
    variables_sensores[modelo] = list(sensor["Lecturas"].keys())

# Generar un archivo Excel vacío por cada modelo de sensor y llenarlo con los valores correspondientes
for modelo in modelos_unicos:
    # Obtener las variables del modelo de sensor actual
    variables = variables_sensores[modelo]
    
    # Crear un DataFrame vacío con las variables como encabezados
    df_vacio = pd.DataFrame(columns=variables)
    
    # Obtener los datos de las variables para cada fila del DataFrame original
    for index, row in df.iterrows():
        # Obtener los datos del sensor correspondiente al modelo actual
        sensores = eval(row["Sensores"])
        sensor_modelo = next((sensor for sensor in sensores if sensor["Modelo"] == modelo), None)
        
        # Verificar si se encontró el sensor del modelo actual
        if sensor_modelo:
            # Obtener las lecturas del sensor
            lecturas = sensor_modelo["Lecturas"]
            
            # Crear una lista con los valores de las variables correspondientes
            valores_variables = [lecturas[variable] for variable in variables]
            
            # Agregar una nueva fila con los valores de las variables al DataFrame vacío
            df_vacio.loc[index] = valores_variables
    
    # Agregar las columnas "Fecha RTC Nodo", "Hora RTC Nodo", "Fecha RTC Server" y "Hora RTC Server" al DataFrame de los sensores
    df_vacio.insert(0, "Fecha RTC Nodo", df["Fecha RTC Nodo"])
    df_vacio.insert(1, "Hora RTC Nodo", df["Hora RTC Nodo"])
    df_vacio.insert(2, "Fecha RTC Server", df["Fecha RTC Server"])
    df_vacio.insert(3, "Hora RTC Server", df["Hora RTC Server"])

    # Crear un nombre único para el archivo Excel
    nombre_excel = f"/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_003/modelo_{modelo}.xlsx"
    
    # Guardar el DataFrame con los valores en el archivo Excel
    df_vacio.to_excel(nombre_excel, index=False)
    
    # Imprimir mensaje de confirmación
    print(f"Archivo Excel '{nombre_excel}' para el modelo de sensor '{modelo}' generado y llenado exitosamente.")



# Crear un DataFrame vacío para los sensores de estado
#df_sensores_estado = pd.DataFrame()

# Obtener los datos de la columna "Sensores Estado"
#sensores_estado_data = df["Sensores Estado"].apply(lambda x: eval(x.replace("'", "\"")))

# Crear una lista para almacenar los encabezados
#headers = []

# Iterar sobre los datos de los sensores de estado y agregarlos al DataFrame
#for sensores_estado_lista in sensores_estado_data:
#    estados_fila = {}  # Diccionario para almacenar los estados de cada fila
#    for sensor_estado in sensores_estado_lista:
#        estado = sensor_estado["estado"]
#        modelo_sensor_estado = sensor_estado["modelo_sensor_estado"]
#        sensor_estado_id = sensor_estado["id_sensor_estado"]
#        header = f"estado_{sensor_estado_id}_{modelo_sensor_estado}"
#        headers.append(header)  # Agregar el encabezado a la lista de encabezados
#        estados_fila[header] = estado
    
    # Agregar el diccionario de estados como una nueva fila al DataFrame de sensores de estado
 #   df_sensores_estado = df_sensores_estado.append(estados_fila, ignore_index=True)

# Agregar las columnas de fecha y hora al DataFrame de los sensores de estado
#df_sensores_estado.insert(0, "Fecha RTC Nodo", df["Fecha RTC Nodo"])
#df_sensores_estado.insert(1, "Hora RTC Nodo", df["Hora RTC Nodo"])
#df_sensores_estado.insert(2, "Fecha RTC Server", df["Fecha RTC Server"])
#df_sensores_estado.insert(3, "Hora RTC Server", df["Hora RTC Server"])

# Crear un nombre único para el archivo Excel
#nombre_excel = "/home/tomas/Documentos/GitHub/negrito/Data/grupo_001/nodo_002/sensores_estado.xlsx"

# Guardar el DataFrame con los valores en el archivo Excel
#df_sensores_estado.to_excel(nombre_excel, index=False)

# Imprimir mensaje de confirmación
#print(f"Archivo Excel '{nombre_excel}' para los sensores de estado generado y llenado exitosamente.")
