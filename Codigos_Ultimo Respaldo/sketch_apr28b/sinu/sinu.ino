#include <SPI.h>
#include <Arduino.h>
#define Threshold 400
#define MQ2pin 0
float sensorValue;
#include <math.h> // Asegúrate de incluir la biblioteca de matemáticas para usar la función sin()

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
const byte addresses [][6] = {"00001", "00002","00003","00004"};  
RF24 radio(CE_PIN, CSN_PIN);
//vector con los datos a enviar
float datos[5];
float datos2[5];
String valor="30";
const char* ssid = "Redmi Note 12 Pro 5G";
const char* password = "Plomo1994!";
const char* mqtt_server = "192.168.81.249";
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

  radio.begin();                            //Starting the radio communication
  
    
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
// sensor();
 radio.startListening();  
  }


if (orden == "nodo_001accionador_001ON") {
  digitalWrite(9, LOW);
} else if (orden == "nodo_001accionador_001OFF") {
  digitalWrite(9, HIGH);
} else if (orden == "nodo_001accionador_002ON") {
  digitalWrite(10, LOW);
} else if (orden == "nodo_001accionador_002OFF") {
  digitalWrite(10, HIGH);
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


//int periodo = 3000;
//unsigned long TiempoAhora = 0;




// Variables globales
unsigned long previousMillis = 0; // Guardar el tiempo anterior
const long interval = 50; // Intervalo de 1 segundo (1000 milisegundos)

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

    // Obtener el tiempo actual
  unsigned long currentMillis = millis();

  // Verificar si ha pasado el intervalo de 1 segundo
  if (currentMillis - previousMillis >= interval) {
    // Guardar el tiempo actual
    previousMillis = currentMillis;

    // Llamar a la función que deseas ejecutar cada segundo
    ejecutarCadaSegundo();
  }

  radio.openWritingPipe(addresses[0]);      //Setting the address at which we will send the data
  radio.openReadingPipe(1, addresses[1]);   //Setting the address at which we will receive the data
  radio.setPALevel(RF24_PA_MIN); 
  radio.startListening();
  if (radio.available()) {
    radio.read(datos,sizeof(datos));
     //reportamos por el puerto serial los datos recibidos
      Serial.print("NODO_002" );
     Serial.print("Dato0= " );
     Serial.print(datos[0]);
     Serial.print("Dato1= " );
     Serial.print(datos[1]);
      Serial.print("Dato2= " );
     Serial.print(datos[2]);
     Serial.print("Dato3= " );
     Serial.print(datos[3]);
       Serial.print("Dato4= " );
     Serial.println(datos[4]);
   char lcdText[20];
sprintf(lcdText, "1A: %.1f 1B: %.1f", datos[0], datos[1]);
lcd.setCursor(0, 2);
lcd.print(lcdText);
   delay(100); 
   radio.stopListening();
    radio.write(&button_stateA, sizeof(button_stateA));  // Enviar el entero button_stateA de vuelta
      delay(100); 
 }
  
 } 
 
void ejecutarCadaSegundo() {
 sensor();
}


// Definición de variables para la señal sinusoidal
const float frecuencia = 0.1; // Frecuencia de la señal sinusoidal (puedes ajustarla)
float tiempo = 0; // Variable para almacenar el tiempo
const float offset = 50; // Offset de la señal sinusoidal
const float amplitud = 10; // Amplitud de la señal sinusoidal (varía de -10 a +10)

void sensor() {
  sensorValue = analogRead(MQ2pin); // leer el pin de entrada analógica 0
  float h = dht.readHumidity();
  float f = dht.readTemperature(true);
  
  if (isnan(h) || isnan(f)) {
    Serial.println("Error obteniendo los datos del sensor DHT11");
    return;
  }

  // Generar el valor de temperatura como una señal sinusoidal
  float t = amplitud * sin(frecuencia * tiempo); // Generar la temperatura sinusoidal

  // Actualizar el tiempo para la próxima llamada
  tiempo += 1; // Incrementar el tiempo (puedes ajustar el incremento según sea necesario)

  float hif = dht.computeHeatIndex(f, h);
  float hic = dht.computeHeatIndex(t, h, false);
  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d", now.year(), now.month(), now.day());  
  sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());

  String mensaje = "";
  int actA;
  int actB;

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

  StaticJsonDocument<1024> doc;

  doc["grupo"] = "grupo_001";
  JsonObject rtc_nodo = doc.createNestedObject("rtc_nodo");
  rtc_nodo["fecha"] = String(t2);
  rtc_nodo["hora"] = String(t3);

  JsonArray nodos = doc.createNestedArray("nodos");

  // nodo_001
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
  nodos_0_sensores_0_lecturas["temperatura"] = t; // Usar el valor sinusoidal
  nodos_0_sensores_0_lecturas["humedad"] = h;

  // Obtener el array "sensores_estado" del nodo_001
  JsonArray nodos_0_sensores_estado = nodos_0.createNestedArray("sensores_estado");

  // Agregar objetos al array "sensores_estado"
  JsonObject sensor_estado_1 = nodos_0_sensores_estado.createNestedObject();
  sensor_estado_1["id_sensor_estado"] = "sensor_estado_001";
  sensor_estado_1["modelo_sensor_estado"] = "CONTACT";
  sensor_estado_1["estado"] = 0;

  serializeJson(doc, mensaje);
  Serial.println(mensaje);
  client.publish("grupo_001", mensaje.c_str());

}
