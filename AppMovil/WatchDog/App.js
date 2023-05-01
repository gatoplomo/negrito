import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';

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

function HomeScreen({ navigation }) {
  return <FlatListBasics navigation={navigation} />;
}

function NodosScreen({ route, navigation }) {
  const [nodos, setNodos] = useState([]);

  useEffect(() => {
    console.log('nodos_grupo:', route.params.nodos_grupo);
    alert('nodos_grupo: ' + route.params.nodos_grupo);
    setNodos(route.params.nodos_grupo); // Actualizar los nodos con los datos del grupo seleccionado
  }, [route.params.nodos_grupo]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={nodos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => navigation.navigate('Nodo', { sensores: item.sensores})}
          >
            <Text>{item.id_nodo}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id_nodo.toString()}
      />
    </View>
  );
}

function NodoScreen({ route }) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={route.params.sensores}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <View style={{ flex: 1, backgroundColor: '#F0F8FF', padding: 5 }}>
              <Text>Sensor ID: {item.id_sensor}</Text>
              <Text>Modelo: {item.modelo_sensor}</Text>
            </View>
            {Object.keys(item.variables_sensor).map((variable, index) => (
              <View style={{ flex: 1, backgroundColor: '#E6E6FA', padding: 5 }} key={index}>
                <Text>{variable}</Text>
                <Text>{item.variables_sensor[variable]}</Text>
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item) => item.id_sensor.toString()}
      />
    </View>
  );
}


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Nodos" component={NodosScreen} />
        <Stack.Screen name="Nodo" component={NodoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
