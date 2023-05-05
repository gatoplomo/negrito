import { Client, Message } from 'react-native-paho-mqtt';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState , useRef} from 'react';
import 'react-native-gesture-handler';
// Agregar estas líneas



function connectMQTT(setMqttMessage) {

const ID = 'mqttjs_' + Math.random().toString(16).substr(2, 8)






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
const client = new Client({ uri: 'ws://192.168.19.36:9001/ws', clientId: 'clientId', storage: myStorage });




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
  client.on('messageReceived', (message) => {
    const mensajeJSON = JSON.parse(message.payloadString);
    console.log(JSON.stringify(mensajeJSON));
    setMqttMessage(mensajeJSON);
  });

}
export { connectMQTT };