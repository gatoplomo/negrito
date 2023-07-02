import pandas as pd

# El JSON proporcionado
json_data = {
    "_id": "ObjectId(\"649293387ea848142b0534f1\")",
    "grupo": "grupo_001",
    "rtc_nodo": {"fecha": "23-04-2023", "hora": "13:30"},
    "nodos": [
        {
            "id_nodo": "nodo_001",
            "accionadores": [
                {"id_accionador": "accionador_001", "status": 1},
                {"id_accionador": "accionador_002", "status": 1}
            ],
            "sensores": [
                {
                    "id_sensor": "sensor_001",
                    "modelo": "DTH11",
                    "lecturas": {"temperatura": 19.39999962, "humedad": 61}
                }
            ]
        },
        {
            "id_nodo": "nodo_002",
            "accionadores": [
                {"id_accionador": "accionador_001", "status": 0},
                {"id_accionador": "accionador_002", "status": 1}
            ],
            "sensores": [
                {
                    "id_sensor": "sensor_001",
                    "modelo": "DTH11",
                    "lecturas": {"temperatura": 0, "humedad": 0}
                },
                {
                    "id_sensor": "sensor_002",
                    "modelo": "MQ2",
                    "lecturas": {"ppm": 0}
                }
            ],
            "sensores_estado": [
                {
                    "id_sensor_estado": "sensor_estado_001",
                    "modelo_sensor_estado": "CONTACT",
                    "estado": 0
                },
                {
                    "id_sensor_estado": "sensor_estado_002",
                    "modelo_sensor_estado": "PIR",
                    "estado": 0
                }
            ]
        }
    ],
    "rtc_server": {"fecha": "2023-06-21", "hora": "02:05:44"}
}

# Convertir el JSON en un DataFrame de pandas
df = pd.json_normalize(
    json_data,
    "nodos",
    ["grupo", ["rtc_nodo", "fecha"], ["rtc_nodo", "hora"], ["rtc_server", "fecha"], ["rtc_server", "hora"]],
    errors='ignore'
)

# Guardar el DataFrame en un archivo Excel
df.to_excel("data.xlsx", index=False)
