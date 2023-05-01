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
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#define CE_PIN D0
#define CSN_PIN D3
#define SCK D5
byte direccion[5] ={'c','a','n','a','l'};
RF24 radio(CE_PIN, CSN_PIN);
//vector con los datos a enviar
float datos[3];
String valor="30";
int bandera=0;
const char* ssid = "negrito";
const char* password = "13921994";
const char* mqtt_server = "192.168.85.36";
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





void setup() {

  wifi_set_sleep_type(LIGHT_SLEEP_T);
  //pinMode(9, INPUT); // Configura GPIO9 como entrada
  //pinMode(10, INPUT); // Configura GPIO10 como entrada
  // Inicializar el LCD
  lcd.init();
  
   pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
 
  //Encender la luz de fondo.
  lcd.backlight();
  
 lcd.setCursor (0,0) ;
 lcd.print("CONECTANDO");

lcd.clear();


  //pinMode(GPIO_Pin,OUTPUT);
 // digitalWrite(GPIO_Pin,HIGH);
 //Init Serial USB
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
  radio.begin();
  radio.openReadingPipe(1, direccion);
  radio.startListening();      
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





int myPins[] = {0,0};

void callback(char* topic, byte* payload, unsigned int length) {

 
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
      delay(5000);
    }
  }
  client.subscribe("control");
}


int periodo = 5000;
unsigned long TiempoAhora = 0;






void loop() {
  if (!client.connected()) {
    reconnect();
  }
   uint8_t numero_canal;

 if ( radio.available() )
 {    
     radio.read(datos,sizeof(datos));
     Serial.print("Dato0= " );
     Serial.print(datos[0]);
     Serial.print(" V, ");
     Serial.print("Dato1= " );
     Serial.print(datos[1]);
     Serial.print(" ms, ");
     Serial.print("Dato2= " );
     Serial.println(datos[2]);

     lcd.setCursor (0,2) ;
     lcd.print("nodo_002_RFOK");
 }
 else
 {
    //lcd.setCursor (0,2) ;
     //lcd.print("n002error");
 }
  client.loop();
  if(millis() > TiempoAhora + periodo){
    sensor();
    TiempoAhora = millis();
    }  
}





void sensor(){
lcd.setCursor (0,3) ;
lcd.print("          ");
  sensorValue = analogRead(MQ2pin); // read analog input pin 0
  Serial.print("Sensor Value: ");
  Serial.println(sensorValue);
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
  Serial.print(F("Date/Time: "));
  Serial.println(String(t2));
  
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.print(" *C ");
  Serial.print(f);
  Serial.print(" *F\t");
  Serial.print("Índice de calor: ");
  Serial.print(hic);
  Serial.print(" *C ");
  Serial.print(hif);
  Serial.println(" *F");
  Serial.println(valor);

String mensaje="";




 
StaticJsonDocument<768> doc;

doc["grupo"] = "grupo_001";
doc["fecha"] = "23-04-2023";
doc["hora"] = "13:30";

JsonArray nodos = doc.createNestedArray("nodos");

//gateway
JsonObject nodos_0 = nodos.createNestedObject();
nodos_0["id_nodo"] = "nodo_001";

JsonArray nodos_0_sensores = nodos_0.createNestedArray("sensores");

JsonObject nodos_0_sensores_0 = nodos_0_sensores.createNestedObject();
nodos_0_sensores_0["modelo"] = "DTH11";

JsonObject nodos_0_sensores_0_lecturas = nodos_0_sensores_0.createNestedObject("lecturas");
nodos_0_sensores_0_lecturas["temperatura"] =t;
nodos_0_sensores_0_lecturas["humedad"] =h;

JsonObject nodos_0_sensores_1 = nodos_0_sensores.createNestedObject();
nodos_0_sensores_1["modelo"] = "MQ2";

JsonObject nodos_0_sensores_1_lecturas = nodos_0_sensores_1.createNestedObject("lecturas");
nodos_0_sensores_1_lecturas["ppm"] = sensorValue;

JsonObject nodos_1 = nodos.createNestedObject();
nodos_1["id_nodo"] = "nodo_002";

//RF1
JsonArray nodos_1_sensores = nodos_1.createNestedArray("sensores");

JsonObject nodos_1_sensores_0 = nodos_1_sensores.createNestedObject();
nodos_1_sensores_0["modelo"] = "DTH11";

JsonObject nodos_1_sensores_0_lecturas = nodos_1_sensores_0.createNestedObject("lecturas");
nodos_1_sensores_0_lecturas["temperatura"] = datos[2];
nodos_1_sensores_0_lecturas["humedad"] = datos[1];

JsonObject nodos_1_sensores_1 = nodos_1_sensores.createNestedObject();
nodos_1_sensores_1["modelo"] = "MQ2";

JsonObject nodos_1_sensores_1_lecturas = nodos_1_sensores_1.createNestedObject("lecturas");
nodos_1_sensores_1_lecturas["ppm"] = datos[0];

serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("grupo_001",mensaje.c_str());

//lcd.clear();
lcd.setCursor (0,0) ;
lcd.print(String(t3)+" "+String(t2));
lcd.setCursor (0,1) ;
lcd.print("t/h:"+String(t)+"/"+String(h));
lcd.setCursor (0,3) ;
lcd.print("Conectado");
lcd.setCursor (0,2) ;
lcd.print("                 ");
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
