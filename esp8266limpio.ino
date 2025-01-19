#include <SPI.h>
#include <Arduino.h>
#define Threshold 400
#define MQ2pin 0

float sensorValue;

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <DHT.h>
#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#include <Wire.h>
#include <RTClib.h>
RTC_DS3231 rtc;
char t2[32];
char t3[32];


float datos[5];
float datos2[5];
String valor="30";
const char* ssid = "datadog";
const char* password = "12345678";
const char* mqtt_server = "192.168.207.193";
const char* clientID = "grupo_001";
WiFiClient espClient;
PubSubClient client(espClient);
#include <Wire.h>
long lastMsg = 0;
char msg[50];
int value = 0;
void ICACHE_RAM_ATTR IntCallback();
void ICACHE_RAM_ATTR IntCallback2();
boolean act1= false;
boolean act2 = false;
int sup=21;
int inf=19;
#include <EEPROM.h>
//Constants
#define EEPROM_SIZE 12



int button_stateA; 







void setup() {
    
pinMode(14, OUTPUT);
pinMode(12, OUTPUT);

Serial.begin(115200);
Serial.println(F("Initialize System"));
  //Init EEPROM
  

  
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1884);
  client.setCallback(callback);
 client.setBufferSize(1024);
    dht.begin();


    
        pinMode(14,OUTPUT);
     pinMode(12,OUTPUT);
 //  pinMode(D8,INPUT);
   //pinMode(D7,INPUT);
  
     
     digitalWrite(D5,HIGH);
     digitalWrite(D6,HIGH);


Wire.begin();

 rtc.begin();

    
}



void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

bool flag = true; // Variable de bandera
int opcion1=1;
int opcion2=1;
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);

  String orden = "";
  for (int i = 0; i < length; i++) {
    orden += (char)payload[i];
  }
  Serial.println(orden);

  // Verificar si la orden es "DETENER"
  if (orden == "Reportar") {
 sensor(); 
  }


if (orden == "nodo_001accionador_001ON") {
  digitalWrite(14, LOW);
} else if (orden == "nodo_001accionador_001OFF") {
  digitalWrite(14, HIGH);
} else if (orden == "nodo_001accionador_002ON") {
  digitalWrite(12, LOW);
} else if (orden == "nodo_001accionador_002OFF") {
  digitalWrite(12, HIGH);
} 

else if (orden == "nodo_002accionador_001ON") {
opcion1=0;
} 
else if (orden == "nodo_002accionador_001OFF") {
opcion1=1;
} 
else if (orden == "nodo_002accionador_002OFF") {
opcion2=1;
} 
else if (orden == "nodo_002accionador_002ON") {
opcion2=0;
} 

if (opcion1==1 && opcion2==1) {
  button_stateA =10;
} 
else if (opcion1==1 && opcion2==0) {
button_stateA =20;
} 
else if (opcion1==0 && opcion2==1) {
button_stateA =30;
} 
else if (opcion1==0 && opcion2==0) {
button_stateA =40;
} 
}



void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    client.subscribe("");
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientID)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(2000);
    }
  }
  client.subscribe("grupo_001control");
}








void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

 } 
 







void sensor(){
  sensorValue = analogRead(MQ2pin); // read analog input pin 0
  //Serial.print("Sensor Value: ");
  //Serial.println(sensorValue);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Error obteniendo los datos del sensor DHT11");
    return;
  }
 
  float hif = dht.computeHeatIndex(f, h);
  float hic = dht.computeHeatIndex(t, h, false);
  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d",now.year(), now.month(), now.day());  
    sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());

String mensaje="";
int actA;
int actB;

if(datos[3]==10)
{
actA=1;
actB=1;
  }
else if(datos[3]==20)
{
  actA=1;
actB=0;
  }
else if(datos[3]==30)
{
  
  actA=0;
actB=1;
  
  }
else if(datos[3]==40)
{
  actA=0;
actB=0;
  }

 
StaticJsonDocument<1024> doc;


doc["grupo"] = "grupo_001";
JsonObject rtc_nodo = doc.createNestedObject("rtc_nodo");
rtc_nodo["fecha"] = "23-04-2023";
rtc_nodo["hora"] = "13:30";

JsonArray nodos = doc.createNestedArray("nodos");

//gateway
JsonObject nodos_0 = nodos.createNestedObject();
nodos_0["id_nodo"] = "nodo_001";


// Accionadores del primer nodo (nodo_001)
JsonArray nodos_0_accionadores = nodos_0.createNestedArray("accionadores");

// Accionador 1 del nodo_001
JsonObject nodos_0_accionadores_0 = nodos_0_accionadores.createNestedObject();
nodos_0_accionadores_0["id_accionador"] = "accionador_001";
nodos_0_accionadores_0["status"] = digitalRead(D5);

// Accionador 2 del nodo_001
JsonObject nodos_0_accionadores_1 = nodos_0_accionadores.createNestedObject();
nodos_0_accionadores_1["id_accionador"] = "accionador_002";
nodos_0_accionadores_1["status"] = digitalRead(D6);


JsonArray nodos_0_sensores = nodos_0.createNestedArray("sensores");

JsonObject nodos_0_sensores_0 = nodos_0_sensores.createNestedObject();
nodos_0_sensores_0["id_sensor"] = "sensor_001";
nodos_0_sensores_0["modelo"] = "DTH11";

JsonObject nodos_0_sensores_0_lecturas = nodos_0_sensores_0.createNestedObject("lecturas");
nodos_0_sensores_0_lecturas["temperatura"] =t;
nodos_0_sensores_0_lecturas["humedad"] =h;


serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("grupo_001", mensaje.c_str());



  }
