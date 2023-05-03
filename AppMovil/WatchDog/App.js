import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import 'react-native-gesture-handler';
// Agregar estas líneas

import LoginScreen from './login.js';


import { Svg, Circle, Text as SVGText } from 'react-native-svg'




const ID = 'mqttjs_' + Math.random().toString(16).substr(2, 8)




import { Client, Message } from 'react-native-paho-mqtt';

//Set up an in-memory alternative to global localStorage
const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

// Create a client instance
const client = new Client({ uri: 'ws://192.168.247.36:9001/ws', clientId: 'clientId', storage: myStorage });

// set event handlers
client.on('connectionLost', (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log(responseObject.errorMessage);
  }
});

// connect the client
client.connect()
  .then(() => {
    // Once a connection has been made, make a subscription and send a message.
    console.log('onConnect');
    return client.subscribe('grupo_001');
  })
  .then(() => {

  })
  .catch((responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  })
;



function HomeScreen({ navigation }) {
  return <FlatListBasics navigation={navigation} />;
}



const ids=[]
const refs = [];




const CircularProgress = (props) => {
  const { size, strokeWidth, id ,numero} = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;

  const text = props.numero.toString();
  const svgProgress = 100 - props.numero;



  return (
    <View style={{ margin: 10 }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={props.bgColor ? props.bgColor : "#f2f2f2"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          {...{ strokeWidth }}
        />

        {/* Progress Circle */}
        <Circle
          stroke={props.pgColor ? props.pgColor : "#3b5998"}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          {...{ strokeWidth }}
        />

        {/* Text */}
        <SVGText
          fontSize={props.textSize ? props.textSize : "10"}
          x={size / 2}
          y={size / 2 + (props.textSize ? (props.textSize / 2) - 1 : 5)}
          textAnchor="middle"
          fill={props.textColor ? props.textColor : "#333333"}
        >
          {text}
        </SVGText>
      </Svg>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const FlatListBasics = ({ navigation }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/datos')
      .then(response => response.json())
      .then(data => {
        setDatos(data);
        console.log(data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={datos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('Nodos', {
                nodos_grupo: item.nodos_grupo,
                grupo:item.id_grupo,
              })
            }
          >
            <Text>{item.id_grupo}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};





function NodosScreen({ route, navigation }) {
  const [nodos, setNodos] = useState([]);
  const { nodos_grupo, grupo, id_grupo } = route.params;

  useEffect(() => {
    console.log('nodos_grupo:', nodos_grupo);
    alert('nodos_grupo: ' + nodos_grupo);
    setNodos(nodos_grupo); // Actualizar los nodos con los datos del grupo seleccionado
  }, [nodos_grupo]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={nodos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => navigation.navigate('Nodo', { sensores: item.sensores , nodo:item.id_nodo, grupo:grupo})}
          >
            <Text>{item.id_nodo}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id_nodo.toString()}
      />
      <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center' }}>
        <Text>Grupo: {grupo}</Text>
      </View>
    </View>
  );
}



function NodoScreen({ route }) {

const id_vars = [];

client.on('messageReceived', (message) => {
  const idsLecturas = [];
  const mensajeJSON = JSON.parse(message.payloadString);

  const obtenerIdsLecturas = (objeto) => {
    objeto.nodos.forEach((nodo) => {
      nodo.sensores.forEach((sensor) => {
        const idSensor = sensor.id_sensor;
        const modelo = sensor.modelo;
        for (const [key, value] of Object.entries(sensor.lecturas)) {
          idsLecturas.push({
            id: `${objeto.grupo}${nodo.id_nodo}${idSensor}${modelo}${key}`,
            lectura: value.toFixed(2) // limitamos a 2 decimales
          });
        }
      });
    });
  };

  obtenerIdsLecturas(mensajeJSON);

  for (let i = 0; i < idsLecturas.length; i++) {
    for (let i2 = 0; i2 < id_vars.length; i2++) {
      if (idsLecturas[i].id == id_vars[i2]) {
        console.log("MATCH");
        setProgreso((prevState) => ({
          ...prevState,
          [id_vars[i2]]: Number(idsLecturas[i].lectura) // convertimos a número
        }));
      }
    }
  }
});

const { sensores, nodo, grupo } = route.params;
const [progreso, setProgreso] = useState({});
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sensores}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <View style={{ flex: 1, backgroundColor: '#F0F8FF', padding: 5 }}>
              <Text>Sensor ID: {item.id_sensor}</Text>
              <Text>Modelo: {item.modelo_sensor}</Text>
            </View>
            {Object.keys(item.variables_sensor).map((variable, index) => {
              alert(variable)
              const id =
                grupo + nodo + item.id_sensor + item.modelo_sensor + variable;
                id_vars.push(id)

              return (
                <TouchableOpacity
                  onPress={() => handleCircularPress(id)}
                  key={index}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#E6E6FA',
                      padding: 5,
                      textAlign: 'center',
                    }}
                  >
                    <View
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <CircularProgress
                        size={100}
                        strokeWidth={10}
                        id={id}
                        numero={progreso[id] || 0} // Obtenemos el progreso correspondiente a la identificación única actual, si no existe aún, lo iniciamos en 0
                      />
                      <Text>{variable}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        keyExtractor={(item) => item.id_sensor.toString()}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Text>Grupo: {grupo}</Text>
        <Text>Nodo: {nodo}</Text>
        <Text>Ruta: {grupo + nodo}</Text>
      </View>
    </View>
  );
}




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Nodos" component={NodosScreen} />
    <Stack.Screen name="Nodo" component={NodoScreen} />
  </Stack.Navigator>
</NavigationContainer>

  );
}
