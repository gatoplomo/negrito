function connectMQTT() {
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}
const host = 'ws://192.168.19.36:9001' 
console.log('Connecting mqtt client')
const client = mqtt.connect(host, options)
client.on('error', (err) => {
  console.log('Connection error: ', err)
  //client.end()
})
client.on('reconnect', () => {
  console.log('Reconnecting...')
})

 return client;
}

export { connectMQTT };