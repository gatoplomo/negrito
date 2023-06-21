#include <Arduino.h>

/* Change the threshold value with your own reading */
#define Threshold 400

#define MQ2pin 0

float sensorValue;  //variable to store sensor value
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
 
//Declaremos los pines CE y el CSN
#define CE_PIN D0
#define CSN_PIN D3
#define SCK D5
 
//Variable con la dir
//Variable con la dirección del canal por donde se va a transmitir
byte direccion[5] ={'c','a','n','a','l'};

//creamos el objeto radio (NRF24L01)
RF24 radio(CE_PIN, CSN_PIN);

//vector con los datos a enviar
float datos[3];








String valor="30";

int bandera=0;
const char* ssid = "negrito";
const char* password = "13921994";
const char* mqtt_server = "192.168.19.36";
const char* clientID = "grupo_001";

WiFiClient espClient;
PubSubClient client(espClient);
#include <Wire.h>

String modo="manualpero";




long lastMsg = 0;
char msg[50];
int value = 0;



void ICACHE_RAM_ATTR IntCallback();
void ICACHE_RAM_ATTR IntCallback2();

//uint8_t GPIO_Pin = D8;
//uint8_t GPIO_Pin2 = D7;


boolean act1= false;
boolean act2 = false;

int sup=21;
int inf=19;


#include <EEPROM.h>

//Constants
#define EEPROM_SIZE 12
int bandera1=1;




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

    dht.begin();


    
        pinMode(9,OUTPUT);
     pinMode(10,OUTPUT);
   pinMode(D8,INPUT);
   //pinMode(D7,INPUT);
  
     
     digitalWrite(9,HIGH);
     digitalWrite(10,HIGH);


 //attachInterrupt(digitalPinToInterrupt(D7), IntCallback, FALLING);


 
 //attachInterrupt(digitalPinToInterrupt(GPIO_Pin2), IntCallback2, FALLING);

Wire.begin();

 rtc.begin();
 //rtc.adjust(DateTime(F(__DATE__),F(__TIME__)));
  //rtc.adjust(DateTime(2023, 4,4, 15, 37,00 ));

      //digitalWrite(GPIO_Pin,LOW);

//inicializamos el NRF24L01 
  radio.begin();
  
  //Abrimos el canal de Lectura
  radio.openReadingPipe(1, direccion);
  
    //empezamos a escuchar por el canal
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

  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  lcd.setCursor (0,3) ;
   lcd.print("Evento Recibido");
String  orden=" ";

  for (int i = 0; i < length; i++) {
    //Serial.print((char)payload[i]);
    orden+=(char)payload[i];
  }
  Serial.println(orden);


if(orden==" Accionador0#ON;")
{

myPins[0]=1;
//bandera1=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
String mensaje="";
DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);



doc["Evento"] = "Cambio de estado";
doc["Generado_por"] = "nodo1";
doc["Info"] = "Respuesta_Solicitud_Cambio_de_estado_WEB/MANUAL";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Accionador"]="Accionador_A";
doc["Funcion"]="Ventilador";
doc["Estado"]="APAGADO";

serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("evento",mensaje.c_str());



}
else if(orden==" Accionador0#OFF;")
{
myPins[0]=0;
  //bandera1=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
String mensaje="";
DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);
  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d",now.year(), now.month(), now.day());  
    sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  Serial.print(F("Date/Time: "));
  Serial.println(String(t2));


doc["Evento"] = "Cambio de estado";
doc["Generado_por"] = "";
doc["Info"] = "Respuesta_Solicitud_Cambio_de_estado_WEB/MANUAL";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Accionador"]="Accionador_A";
doc["Funcion"]="Ventilador";
doc["Estado"]="APAGADO";


serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("evento",mensaje.c_str());

 
}
else if(orden==" Accionador1#ON;")
{
  //bandera1=0;
myPins[1]=1;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
String mensaje="";
DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);
  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d",now.year(), now.month(), now.day());  
    sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  Serial.print(F("Date/Time: "));
  Serial.println(String(t2));

doc["Evento"] = "Cambio de estado";
doc["Generado_por"] = "";
doc["Info"] = "Respuesta_Solicitud_Cambio_de_estado_WEB/MANUAL";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Accionador"]="Accionador_B";
doc["Funcion"]="Ventilador";
doc["Estado"]="APAGADO";

serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("evento",mensaje.c_str());

}
else if(orden==" Accionador1#OFF;")
{
  //bandera1=0;
myPins[1]=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
String mensaje="";
DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);
  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d",now.year(), now.month(), now.day());  
    sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  Serial.print(F("Date/Time: "));
  Serial.println(String(t2));

doc["Evento"] = "Cambio de estado";
doc["Generado_por"] = "";
doc["Info"] = "Respuesta_Solicitud_Cambio_de_estado_WEB/MANUAL";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Accionador"]="Accionador_B";
doc["Funcion"]="Ventilador";
doc["Estado"]="APAGADO";

serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("evento",mensaje.c_str());

}

else if(orden==" reset")
{

httprequest2();

}

else if(orden==" manual")
{

modo="manual";
Serial.print("recibiendo modo");

}

else if(orden==" auto")
{

modo="auto";
Serial.print("recibiendo modo");

}



if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(10,LOW);
  digitalWrite(9,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
   
    digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
      
      digitalWrite(10,HIGH);
  digitalWrite(9,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
        
         digitalWrite(10,LOW);
  digitalWrite(9,LOW);
        
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
  client.loop();


 
  if(millis() > TiempoAhora + periodo){
    sensor();
     attachInterrupt(digitalPinToInterrupt(D8), IntCallback, RISING);
     //attachInterrupt(digitalPinToInterrupt(D7), IntCallback2, RISING);
    //Serial.println(digitalRead(14));
    //Serial.println(digitalRead(13));
        TiempoAhora = millis();
        //httprequest();
       //DateTime now = rtc.now();
   //printDate(now);
    }

    
 if(bandera1 == 0){
   httprequest2();
   bandera1=1;

   
 
 }
 


//client.subscribe("nodo3");

// Esperamos 5 segundos entre medidas


  //httprequest2();
    
   
}





void sensor(){

/*
    byte err, adr;       /*variable error is defined with address of I2C*/
  /*
  int number_of_devices;
  Serial.println("Scanning.");
  number_of_devices = 0;
  for (adr = 1; adr < 127; adr++ )
  {
    Wire.beginTransmission(adr);
    err = Wire.endTransmission();

    if (err == 0)
    {
      Serial.print("I2C device at address 0x");
      if (adr < 16)
        Serial.print("0");
      Serial.print(adr, HEX);
      Serial.println("  !");
      number_of_devices++;
    }
    else if (err == 4)
    {
      Serial.print("Unknown error at address 0x");
      if (adr < 16)
        Serial.print("0");
      Serial.println(adr, HEX);
    }
  }
  if (number_of_devices == 0)
    Serial.println("No I2C devices attached\n");
  else
    Serial.println("done\n");
delay(1000);
  */

  sensorValue = analogRead(MQ2pin); // read analog input pin 0
  
  Serial.print("Sensor Value: ");
  Serial.println(sensorValue);
  
   //attachInterrupt(digitalPinToInterrupt(GPIO_Pin), IntCallback, FALLING);
 //attachInterrupt(digitalPinToInterrupt(GPIO_Pin2), IntCallback2, FALLING);
  // Leemos la humedad relativa
  float h = dht.readHumidity();
  // Leemos la temperatura en grados centígrados (por defecto)
  float t = dht.readTemperature();
  // Leemos la temperatura en grados Fahreheit
  float f = dht.readTemperature(true);
 
  // Comprobamos si ha habido algún error en la lectura
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Error obteniendo los datos del sensor DHT11");
    return;
  }
 
  // Calcular el índice de calor en Fahreheit
  float hif = dht.computeHeatIndex(f, h);
  // Calcular el índice de calor en grados centígrados
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
Serial.println(modo);

if(modo=="auto")
{
  if(t > valor.toInt())
  {
  Serial.println("es mayor");
     digitalWrite(10,LOW);
  digitalWrite(9,LOW);;
    }
  else if (t < valor.toInt())
  {
       digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
  Serial.println("es menor");
    }
}
else
{
  
  }
/*
  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    snprintf (msg, 75, "hello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("huerto", msg);
  }
  */

String mensaje="";

  //client.publish("",String(t).c_str());


//Serial.print(digitalRead(D8));
//Serial.println(digitalRead(D7));
 uint8_t numero_canal;
 //if ( radio.available(&numero_canal) )
 if ( radio.available() )
 {    
     //Leemos los datos y los guardamos en la variable datos[]
     radio.read(datos,sizeof(datos));
     
     //reportamos por el puerto serial los datos recibidos
     Serial.print("Dato0= " );
     Serial.print(datos[0]);
     Serial.print(" V, ");
     Serial.print("Dato1= " );
     Serial.print(datos[1]);
     Serial.print(" ms, ");
     Serial.print("Dato2= " );
     Serial.println(datos[2]);
 }
 else
 {
     Serial.println("No hay datos de radio disponibles");
 }
 






DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);

doc["Nodo"] = "nodo1";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Lectura"][0]= String(t);
doc["Lectura"][1]= String(h);
doc["Lectura"][2]= sensorValue;
doc["Lectura2"][0]= datos[0];
doc["Lectura2"][1]= datos[1];
doc["Lectura2"][2]= datos[2];
doc["Status"]= "conectado";
doc["Act1"] = myPins[1];
doc["Act2"] = myPins[0];

String Estado1="";
String Estado2="";
serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("grupo_001",mensaje.c_str());

lcd.clear();
lcd.setCursor (0,0) ;
lcd.print(String(t3)+" "+String(t2));
lcd.setCursor (0,1) ;
lcd.print(String(t));
lcd.setCursor (0,2) ;
lcd.print(String("Acc_A: ")+myPins[0]+" "+String("Acc_B: ")+myPins[1]);
lcd.setCursor (0,3) ;
lcd.print("Conectado      ");
  }


unsigned long last_interrupt_time = 0;



void IntCallback(){

 Serial.println("Interrupcion");

detachInterrupt(digitalPinToInterrupt(D8));
String mensaje="";
DynamicJsonDocument doc(1024);

int estado1;
int estado2;
Serial.println(myPins[0]);
Serial.println(myPins[1]);



  DateTime now = rtc.now();
  sprintf(t2, "%02d-%02d-%02d",now.year(), now.month(), now.day());  
    sprintf(t3, "%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  Serial.print(F("Date/Time: "));
  Serial.println(String(t2));


doc["Nodo"] = "";
doc["Evento"] = "Cambio de Estado";
doc["Origen"] = "Botón/Manual";
doc["Fecha"] = String(t2);
doc["Hora"] = String(t3);
doc["Accionador"] = "Accionador1";
doc["Funcion"] = "Ventilador";
doc["Estado"] = myPins[0];

serializeJson(doc, mensaje);
Serial.println(mensaje);
client.publish("evento",mensaje.c_str());
 lcd.setCursor (0,3) ;
   lcd.print("Cambio de Estado");

if(myPins[0]==0)
{
  myPins[0]=1;
  }
else 
{
  myPins[0]=0;
  }  

if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(10,LOW);
  digitalWrite(9,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
   
    digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
      
      digitalWrite(10,HIGH);
  digitalWrite(9,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
        
         digitalWrite(10,LOW);
  digitalWrite(9,LOW);
        
      }

      
/*

detachInterrupt(digitalPinToInterrupt(GPIO_Pin2));
  detachInterrupt(digitalPinToInterrupt(GPIO_Pin));
 static unsigned long last_interrupt_time = 0;
  unsigned long interrupt_time = millis();
  // If interrupts come faster than 200ms, assume it's a bounce and ignore
  if (interrupt_time - last_interrupt_time > 200)
  {

  Serial.println("boton1");
      if(myPins[1]==1)
     
  {
    Serial.println("Accionador A Apagado");
    bandera1=0;
    myPins[1]=0;
    }
    else if(myPins[1]==0)
    {
      
       Serial.println("Accionador A APAGADO");
      bandera1=0;
      myPins[1]=1;
      }

  }
  last_interrupt_time = interrupt_time;
 if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(10,LOW);
  digitalWrite(9,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(10,HIGH);
  digitalWrite(9,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(10,LOW);
  digitalWrite(9,LOW);
        
      }

      */
}


 



 
 void IntCallback2(){
//detachInterrupt(digitalPinToInterrupt(D7));
detachInterrupt(digitalPinToInterrupt(D8));
  //detachInterrupt(digitalPinToInterrupt(GPIO_Pin));
 static unsigned long last_interrupt_time = 0;
  unsigned long interrupt_time = millis();
  // If interrupts come faster than 200ms, assume it's a bounce and ignore
  if (interrupt_time - last_interrupt_time > 200 )
  {

  Serial.println("boton2");
  if(myPins[1]==1)
  {
    myPins[1]=0;
     bandera1=0;
    Serial.println("AccionadorB Apagado");
    }
    else if(myPins[1]==0)
    {
      myPins[1]=1;
       bandera1=0;
      Serial.println("AccionadorB APAGADO");
      }
  }
 
last_interrupt_time = interrupt_time;


 if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(10,LOW);
  digitalWrite(9,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(10,HIGH);
  digitalWrite(9,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(10,LOW);
  digitalWrite(9,LOW);
        
      }
}


void cut(float t)
{
  Serial.println("hola");
 if(t<inf)
 {
  Serial.println("APAGADO");
  //digitalWrite(12,LOW);
 
  myPins[1]=1;
  }
  else if (t>sup)
  {
    
    Serial.println("Cortado");
     //digitalWrite(12,HIGH);
 
  myPins[1]=0;
    }
  Serial.println(myPins[0]);
 if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(10,LOW);
  digitalWrite(9,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(10,HIGH);
  digitalWrite(9,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(10,HIGH);
  digitalWrite(9,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(10,LOW);
  digitalWrite(9,LOW);
        
      }
  }





#include <ESP8266HTTPClient.h>






// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;



void httprequest() {
  const char* serverName = "http://192.168.228.36:3000/tomers";
  //Send an HTTP POST request every 10 minutes
EEPROM.begin(EEPROM_SIZE);

  //Write data into eeprom
  int address = 0;
  int boardId = 18;
  EEPROM.put(address, boardId);
  address += sizeof(boardId); //update address value
/*
  float param = 26.5;
  EEPROM.put(address, param);
  EEPROM.commit();
*/
  //Read data from eeprom
  address = 0;
  int readId;
  EEPROM.get(address, readId);
  Serial.print("Read Id = ");
  Serial.println(readId);
  address += sizeof(readId); //update address value

  float readParam;
  EEPROM.get(address, readParam); //readParam=EEPROM.readFloat(address);
  Serial.print("Read param = ");
  Serial.println(readParam);

  EEPROM.end();

  
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
     Serial.println("hola");
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      

auto httpCode = http.POST("hola");
 
Serial.println(httpCode); //Print HTTP return code
 
String payload = http.getString();
 // Define 
//String str = "This is my string"; 

// Length (with one extra character for the null terminator)
int str_len = payload.length() + 1; 

// Prepare the character array (the buffer) 
char char_array[str_len];

// Copy it over 
payload.toCharArray(char_array, str_len);


Serial.println(payload);
//Serial.println(char_array);





//Serial.println(payload); //Print request response payload 
StaticJsonDocument<1024> doc;

  // StaticJsonDocument<N> allocates memory on the stack, it can be
  // replaced by DynamicJsonDocument which allocates in the heap.
  //
  // DynamicJsonDocument doc(200);

  // JSON input string.
  //
  // Using a char[], as shown here, enables the "zero-copy" mode. This mode uses
  // the minimal amount of memory because the JsonDocument stores pointers to
  // the input buffer.
  // If you use another type of input, ArduinoJson must copy the strings from
  // the input to the JsonDocument, so you need to increase the capacity of the
  // JsonDocument.


     


  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, payload);

  // Test if parsing succeeds.
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Fetch values.
  //
  // Most of the time, you can rely on the implicit casts.
  // In other case, you can do doc["time"].as<long>();
 //Serial.println(doc.size());

 for (int i = 0; i < doc.size(); i++) {
    String timer = doc[i]["Timer"];
    String action = doc[i]["Action"];
    Serial.println(timer);
     Serial.println(action);
  }
  

  // Print values.
  
//  Serial.println(timer);




http.end(); //Close connection Serial.println(); 

      
    }
    else {
      Serial.println("WiFi Disconnected");
    }
   
  
}




void httprequest2() {
  const char* serverName = "http://192.168.0.170:3000/actualizar";
  
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
     Serial.println("hola");
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      

auto httpCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");
 
Serial.println(httpCode); //Print HTTP return code
 
String payload = http.getString();
 // Define 
//String str = "This is my string"; 

Serial.println(payload);
//Serial.println(payload); //Print request response payload 
StaticJsonDocument<1024> doc;

  // StaticJsonDocument<N> allocates memory on the stack, it can be
  // replaced by DynamicJsonDocument which allocates in the heap.
  //
  // DynamicJsonDocument doc(200);

  // JSON input string.
  //
  // Using a char[], as shown here, enables the "zero-copy" mode. This mode uses
  // the minimal amount of memory because the JsonDocument stores pointers to
  // the input buffer.
  // If you use another type of input, ArduinoJson must copy the strings from
  // the input to the JsonDocument, so you need to increase the capacity of the
  // JsonDocument.


     


  // Deserialize the JSON document
  DeserializationError error = deserializeJson(doc, payload);

  // Test if parsing succeeds.
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Fetch values.
  //
  // Most of the time, you can rely on the implicit casts.
  // In other case, you can do doc["time"].as<long>();
 //Serial.println(doc.size());

 for (int i = 0; i < doc.size(); i++) {
    String Variable = doc[i]["Variable"];
    String Condicion = doc[i]["Condicion"];
     String Valor = doc[i]["Valor"];
    String Accionador = doc[i]["Accionador"];
        String Estado = doc[i]["Estado"];
    Serial.println(Variable);
     Serial.println(Condicion);
       Serial.println(Valor);
     Serial.println(Accionador);
       Serial.println(Estado);
       valor=Valor;
  }
  

http.end(); //Close connection Serial.println(); 

      
    }
    else {
      Serial.println("WiFi Disconnected");
    }
   
  
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
