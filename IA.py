import tensorflow as tf
from tensorflow.keras import layers
import numpy as np

# Carga los datos de entrenamiento
data = [
    ("Hola", "Hola, ¿en qué puedo ayudarte?"),
    ("Quiero encender la luz", "Luz encendida"),
    ("Quiero apagar la luz", "Luz apagada"),
    ("Adiós", "¡Adiós!"),
]

# Crea un diccionario de palabras y un índice para cada palabra
word_dict = {}
for question, _ in data:
    for word in question.lower().split():
        if word not in word_dict:
            word_dict[word] = len(word_dict)

# Crea un diccionario invertido de índice a palabra
idx_dict = {i: w for w, i in word_dict.items()}

# Convierte las preguntas a vectores de índices
X = []
for question, _ in data:
    vec = [word_dict[w] for w in question.lower().split()]
    X.append(vec)
X = np.array(X)

# Define el modelo
model = tf.keras.Sequential([
    layers.Embedding(input_dim=len(word_dict), output_dim=32),
    layers.LSTM(32),
    layers.Dense(32, activation='relu'),
    layers.Dense(len(data), activation='softmax')
])

# Compila el modelo
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Entrena el modelo
model.fit(X, np.arange(len(data)), epochs=100)

# Preprocesa la entrada del usuario y genera una respuesta
def generate_response(question):
    vec = np.array([word_dict[w] for w in question.lower().split()])
    pred = model.predict(np.expand_dims(vec, axis=0))[0]
    return data[np.argmax(pred)][1]

# Ejemplo de uso
print(generate_response("Hola"))
print(generate_response("Enciende la luz"))
print(generate_response("Apaga la luz"))
print(generate_response("Adiós"))