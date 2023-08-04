#include <SPI.h> ///aaaa
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
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#define CE_PIN D0
#define CSN_PIN D3
#define SCK D5
const byte addresses [][6] = {"11111", "22222","33333","44444"};  
RF24 radio(CE_PIN, CSN_PIN);
//vector con los datos a enviar
float datos[5];
float datos2[2];


float nodo2t=0;
float nodo2h=0;
float nodo3t=0;
float nodo3h=0;


String valor="30";
const char* ssid = "RTM";
const char* password = "zeke1994";
const char* mqtt_server = "192.168.14.36";
const char* clientID = "G1";
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
  //wifi_set_sleep_type(LIGHT_SLEEP_T);
  lcd.init();
  
pinMode(9, OUTPUT);
pinMode(10, OUTPUT);
lcd.backlight();
lcd.setCursor (0,0) ;
lcd.print("CONECTANDO");
lcd.clear();
Serial.begin(115200);
Serial.println(F("Initialize System"));
  //Init EEPROM
  

  
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1884);
  client.setCallback(callback);
 client.setBufferSize(2048);
    dht.begin();


    
        pinMode(9,OUTPUT);
     pinMode(10,OUTPUT);
   pinMode(D8,INPUT);
   //pinMode(D7,INPUT);
  
     
     digitalWrite(9,HIGH);
     digitalWrite(10,HIGH);


Wire.begin();

 rtc.begin();
 //rtc.adjust(DateTime(F(__DATE__),F(__TIME__)));
  //rtc.adjust(DateTime(2023, 4,4, 15, 37,00 )); 

  radio.begin();                            //Starting the radio communication
  radio.openWritingPipe(addresses[0]);      //Setting the address at which we will send the data
  radio.openReadingPipe(1, addresses[1]);   //Setting the address at which we will receive the data
  radio.setPALevel(RF24_PA_HIGH);
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
 radio.startListening();  
  }

if (orden.startsWith("nodo_001accionador_001")) {
  digitalWrite(9, orden.endsWith("ON") ? LOW : HIGH);
} else if (orden.startsWith("nodo_001accionador_002")) {
  digitalWrite(10, orden.endsWith("ON") ? LOW : HIGH);
} else if (orden.startsWith("nodo_002accionador_001")) {
  opcion1 = orden.endsWith("ON") ? 0 : 1;
  datos2[1]=1;//dirección de destino
} else if (orden.startsWith("nodo_002accionador_002")) {
  opcion2 = orden.endsWith("ON") ? 0 : 1;
  datos2[1]=1;//dirección de destino
}
else if (orden.startsWith("nodo_003accionador_001")) {
  opcion1 = orden.endsWith("ON") ? 0 : 1;
  datos2[1]=2;// dirección del nodo de destino
} else if (orden.startsWith("nodo_003accionador_002")) {
  opcion2 = orden.endsWith("ON") ? 0 : 1;
  datos2[1]=2;//dirección del nodo de destino
}

//ordenes
if (opcion1 == 1 && opcion2 == 1) {
  button_stateA = 10;
} else if (opcion1 == 1 && opcion2 == 0) {
  button_stateA = 20;
} else if (opcion1 == 0 && opcion2 == 1) {
  button_stateA = 30;
} else if (opcion1 == 0 && opcion2 == 0) {
  button_stateA = 40;
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


//int periodo = 3000;
//unsigned long TiempoAhora = 0;

int actA;
int actB;
int actC;
int actD;

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  
  radio.startListening();

  if (radio.available()) {
    radio.read(datos, sizeof(datos));
    
    // Reportar por el puerto serial los datos recibidos
    Serial.print("Nodo");
    Serial.print(datos[2]);
    Serial.print("Dato0=");
    Serial.print(datos[0]);
    Serial.print("Dato1=");
    Serial.print(datos[1]);
    Serial.print("Dato3=");
    Serial.print(datos[3]);
    Serial.print("Dato4=");
    Serial.println(datos[4]);

    char lcdText[20];

    if (datos[2] == 1) {
      if (datos[3] == 10) {
        actA = 1;
        actB = 1;
      } else if (datos[3] == 20) {
        actA = 1;
        actB = 0;
      } else if (datos[3] == 30) {
        actA = 0;
        actB = 1;
      } else if (datos[3] == 40) {
        actA = 0;
        actB = 0;
      }
      nodo2t=datos[0];
      nodo2h=datos[1];
      sprintf(lcdText, "%.1f%.1f%.1f%.1f%d%d", datos[0], datos[1], datos[2], datos[3], actA, actB);

      lcd.setCursor(0, 2);
      lcd.print(lcdText);
    } else if (datos[2] == 2) {
      if (datos[3] == 10) {
        actC = 1;
        actD = 1;
      } else if (datos[3] == 20) {
        actC = 1;
        actD = 0;
      } else if (datos[3] == 30) {
        actC = 0;
        actD = 1;
      } else if (datos[3] == 40) {
        actC = 0;
        actD = 0;
      }

      sprintf(lcdText, "%.1f%.1f%.1f%.1f%d%d", datos[0], datos[1], datos[2], datos[3], actD, actC);
      nodo3t=datos[0];
      nodo3h=datos[1];
      lcd.setCursor(0, 3);
      lcd.print(lcdText);
    }

    delay(100);
    radio.stopListening();
    datos2[0] = button_stateA; // mensaje de destino al nodo child, contenido
    radio.write(&datos2, sizeof(datos2));
  }
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



 
const size_t capacity = 2048;
DynamicJsonDocument doc(capacity);


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
nodos_0_accionadores_0["status"] = digitalRead(9);

// Accionador 2 del nodo_001
JsonObject nodos_0_accionadores_1 = nodos_0_accionadores.createNestedObject();
nodos_0_accionadores_1["id_accionador"] = "accionador_002";
nodos_0_accionadores_1["status"] = digitalRead(10);


JsonArray nodos_0_sensores = nodos_0.createNestedArray("sensores");

JsonObject nodos_0_sensores_0 = nodos_0_sensores.createNestedObject();
nodos_0_sensores_0["id_sensor"] = "sensor_001";
nodos_0_sensores_0["modelo"] = "DTH11";

JsonObject nodos_0_sensores_0_lecturas = nodos_0_sensores_0.createNestedObject("lecturas");
nodos_0_sensores_0_lecturas["temperatura"] =t;
nodos_0_sensores_0_lecturas["humedad"] =h;




// RF1
JsonObject nodos_1 = nodos.createNestedObject();
nodos_1["id_nodo"] = "nodo_002";

JsonArray nodos_1_accionadores = nodos_1.createNestedArray("accionadores");

JsonObject nodos_1_accionadores_0 = nodos_1_accionadores.createNestedObject();
nodos_1_accionadores_0["id_accionador"] = "accionador_001";
nodos_1_accionadores_0["status"] = actB;

JsonObject nodos_1_accionadores_1 = nodos_1_accionadores.createNestedObject();
nodos_1_accionadores_1["id_accionador"] = "accionador_002";
nodos_1_accionadores_1["status"] = actA;



JsonArray nodos_1_sensores = nodos_1.createNestedArray("sensores");

JsonObject nodos_1_sensores_0 = nodos_1_sensores.createNestedObject();
nodos_1_sensores_0["id_sensor"] = "sensor_001";
nodos_1_sensores_0["modelo"] = "DTH11";

JsonObject nodos_1_sensores_0_lecturas = nodos_1_sensores_0.createNestedObject("lecturas");
nodos_1_sensores_0_lecturas["temperatura"] = nodo2t;
nodos_1_sensores_0_lecturas["humedad"] = nodo2h;

//RF2
JsonObject nodos_2 = nodos.createNestedObject();
nodos_2["id_nodo"] = "nodo_003";

JsonArray nodos_2_accionadores = nodos_2.createNestedArray("accionadores");

JsonObject nodos_2_accionadores_0 = nodos_2_accionadores.createNestedObject();
nodos_2_accionadores_0["id_accionador"] = "accionador_001";
nodos_2_accionadores_0["status"] = actD;

JsonObject nodos_2_accionadores_1 = nodos_2_accionadores.createNestedObject();
nodos_2_accionadores_1["id_accionador"] = "accionador_002";
nodos_2_accionadores_1["status"] = actC;



JsonArray nodos_2_sensores = nodos_2.createNestedArray("sensores");

JsonObject nodos_2_sensores_0 = nodos_2_sensores.createNestedObject();
nodos_2_sensores_0["id_sensor"] = "sensor_001";
nodos_2_sensores_0["modelo"] = "DTH11";

JsonObject nodos_2_sensores_0_lecturas = nodos_2_sensores_0.createNestedObject("lecturas");
nodos_2_sensores_0_lecturas["temperatura"] =nodo3t;
nodos_2_sensores_0_lecturas["humedad"] = nodo3h;


serializeJson(doc, mensaje);



Serial.println(mensaje);
client.publish("grupo_001", mensaje.c_str());

//lcd.clear();
lcd.setCursor (0,0) ;
lcd.print(String(t3)+" "+String(t2));
lcd.setCursor (0,1) ;
lcd.print("t/h:"+String(t)+"/"+String(h));
//lcd.setCursor (0,3) ;
//lcd.print("Conectado");
//lcd.setCursor (0,2) ;
//lcd.print("                 ");

  }




















/*

void printDate(DateTime date)
{
   Serial.print(date.year(), DEC);
   Serial.print('/');
   Serial.print(date.month(), DEC);
   Serial.print('/');
   Serial.print(date.day(), DEC);
   Serial.print(" (");
   Serial.print(daysOfTheWeek[date.dayOfTheWeek()]);
   Serial.print(") ");
   Serial.print(date.hour(), DEC);
   Serial.print(':');
   Serial.print(date.minute(), DEC);
   Serial.print(':');
   Serial.print(date.second(), DEC);
   Serial.println();
}

*/
