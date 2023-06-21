import csv
from pymongo import MongoClient

# Establecer la conexión con la base de datos MongoDB
client = MongoClient('mongodb://localhost:27017')

# Seleccionar la base de datos
db = client['myproject']

# Seleccionar la colección
collection = db['lecturas_grupo_001']

# Realizar una consulta
resultados = collection.find({})

# Nombre del archivo CSV
nombre_archivo = "/home/tomas/Documentos/GitHub/negrito/Reportes/grupo_001/2023-06-20.csv"

# Abrir el archivo CSV en modo escritura
with open(nombre_archivo, mode='w', newline='') as archivo_csv:
    # Crear el escritor CSV
    writer = csv.DictWriter(archivo_csv, fieldnames=resultados[0].keys())

    # Escribir los encabezados
    writer.writeheader()

    # Escribir cada fila en el archivo CSV
    for documento in resultados:
        writer.writerow(documento)

# Cerrar la conexión con MongoDB
client.close()

print("Archivo CSV generado correctamente.")
