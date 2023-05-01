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
  }, [route.params.nodos_grupo]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={route.params.nodos_grupo}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => navigation.navigate('Nodo', { id_nodo: item.id_nodo })}
          >
            <Text>{item.id_nodo}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id_nodo.toString()}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function NodoScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{route.params.id_nodo}</Text>
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
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
