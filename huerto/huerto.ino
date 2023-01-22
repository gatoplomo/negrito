#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <DHT.h>

// Definimos el pin digital donde se conecta el sensor
#define DHTPIN 2
// Dependiendo del tipo de sensor
#define DHTTYPE DHT11
 
// Inicializamos el sensor DHT11
DHT dht(DHTPIN, DHTTYPE);

#include <Wire.h>


//#include "RTClib.h"
//RTC_DS1307 rtc;
//RTC_DS3231 rtc;
//String daysOfTheWeek[7] = { "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" };
//String monthsNames[12] = { "Enero", "Febrero", "Marzo", "Abril", "Mayo",  "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" };


int bandera=0;
const char* ssid = "WOM-1FFEC0";
const char* password = "06053125";
const char* mqtt_server = "192.168.0.170";
const char* clientID = "nodo1";

WiFiClient espClient;
PubSubClient client(espClient);
#include <Wire.h>






long lastMsg = 0;
char msg[50];
int value = 0;



void ICACHE_RAM_ATTR IntCallback();
void ICACHE_RAM_ATTR IntCallback2();








uint8_t GPIO_Pin = D8;
uint8_t GPIO_Pin2 = D7;


boolean act1= false;
boolean act2 = false;

int sup=21;
int inf=19;


#include <EEPROM.h>

//Constants
#define EEPROM_SIZE 12
int bandera1=1;
void setup() {
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


    
        pinMode(14,OUTPUT);
     pinMode(12,OUTPUT);

     
     digitalWrite(14,HIGH);
     digitalWrite(12,HIGH);


 attachInterrupt(digitalPinToInterrupt(GPIO_Pin), IntCallback, FALLING);
 attachInterrupt(digitalPinToInterrupt(GPIO_Pin2), IntCallback2, FALLING);

 /*
if (!rtc.begin()) {
      Serial.println(F("Couldn't find RTC"));
      while (1);
   }
*/
   /*
   // Si se ha perdido la corriente, fijar fecha y hora
   if (rtc.lostPower()) {
      // Fijar a fecha y hora de compilacion
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
      
     
   }
      //rtc.adjust(DateTime(2021, 8, 17, 18, 16, 0));

*/


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
  detachInterrupt(digitalPinToInterrupt(GPIO_Pin2));
  detachInterrupt(digitalPinToInterrupt(GPIO_Pin));
String  orden=" ";

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    orden+=(char)payload[i];
  }
  Serial.println(orden);


if(orden==" Accionador0#ON;")
{

myPins[0]=1;
//bandera1=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);



}
else if(orden==" Accionador0#OFF;")
{
myPins[0]=0;
  //bandera1=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);

 
}
else if(orden==" Accionador1#ON;")
{
  //bandera1=0;
myPins[1]=1;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
}
else if(orden==" Accionador1#OFF;")
{
  //bandera1=0;
myPins[1]=0;
Serial.print(myPins[0]);
Serial.print(myPins[1]);
}

else if(orden==" reset")
{

httprequest2();

}




if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(D6,LOW);
  digitalWrite(D5,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
   
    digitalWrite(D6,HIGH);
  digitalWrite(D5,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
      
      digitalWrite(D6,HIGH);
  digitalWrite(D5,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
        
         digitalWrite(D6,LOW);
  digitalWrite(D5,LOW);
        
      }



}






void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    client.subscribe("nodo1");
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
  client.subscribe("nodo1control");
}


int periodo = 1000;
unsigned long TiempoAhora = 0;






void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();



  if(millis() > TiempoAhora + periodo){
    sensor();
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

   
   if(digitalRead(14)==HIGH && digitalRead(12)==HIGH )
   {
   client.publish("nodo1reporte","BoffAoff");
   Serial.println("A apagado , B apagado");
    }
    else if(digitalRead(14)==LOW && digitalRead(12)==HIGH)
   {
   client.publish("nodo1reporte","BonAoff");
   Serial.println("encendido");
    }

    else if(digitalRead(14)==HIGH && digitalRead(12)==LOW)
   {
   client.publish("nodo1reporte","BoffAon");
   Serial.println("encendido");
    }
     else if(digitalRead(14)==LOW && digitalRead(12)==LOW)
   {
   client.publish("nodo1reporte","BonAon");
   Serial.println("encendido");
    }
 }
 


//client.subscribe("nodo3");

// Esperamos 5 segundos entre medidas


  //httprequest2();
    
   
}





void sensor(){
   attachInterrupt(digitalPinToInterrupt(GPIO_Pin), IntCallback, FALLING);
 attachInterrupt(digitalPinToInterrupt(GPIO_Pin2), IntCallback2, FALLING);
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

 /*
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
*/
  

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
delay(5000);
 client.publish("nodo1",String(t).c_str());
  
  //cut(t);
  }


unsigned long last_interrupt_time = 0;



void IntCallback(){
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
      
       Serial.println("Accionador A Encendido");
      bandera1=0;
      myPins[1]=1;
      }

  }
  last_interrupt_time = interrupt_time;
 if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(D6,LOW);
  digitalWrite(D5,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(D6,HIGH);
  digitalWrite(D5,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(D6,HIGH);
  digitalWrite(D5,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(D6,LOW);
  digitalWrite(D5,LOW);
        
      }
}


 



 
 void IntCallback2(){
detachInterrupt(digitalPinToInterrupt(GPIO_Pin2));
  detachInterrupt(digitalPinToInterrupt(GPIO_Pin));
 static unsigned long last_interrupt_time = 0;
  unsigned long interrupt_time = millis();
  // If interrupts come faster than 200ms, assume it's a bounce and ignore
  if (interrupt_time - last_interrupt_time > 200 )
  {

  Serial.println("boton2");
  if(myPins[0]==1)
  {
    myPins[0]=0;
     bandera1=0;
    Serial.println("AccionadorB Apagado");
    }
    else if(myPins[0]==0)
    {
      myPins[0]=1;
       bandera1=0;
      Serial.println("AccionadorB Encendido");
      }
  }
 
last_interrupt_time = interrupt_time;


 if(myPins[0]==1 && myPins[1]==0)
{

  digitalWrite(D6,LOW);
  digitalWrite(D5,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(D6,HIGH);
  digitalWrite(D5,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(D6,HIGH);
  digitalWrite(D5,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(D6,LOW);
  digitalWrite(D5,LOW);
        
      }
}


void cut(float t)
{
  Serial.println("hola");
 if(t<inf)
 {
  Serial.println("Encendido");
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

  digitalWrite(D6,LOW);
  digitalWrite(D5,HIGH);
 
    
  
  }
  else if (myPins[0]==0 && myPins[1]==0)
  {
    
    digitalWrite(D6,HIGH);
  digitalWrite(D5,HIGH);
    }
    else if (myPins[0]==0 && myPins[1]==1)
    {
     
      digitalWrite(D6,HIGH);
  digitalWrite(D5,LOW);
      
      
    
      }
      else if(myPins[0]==1 && myPins[1]==1)
      {
      
         digitalWrite(D6,LOW);
  digitalWrite(D5,LOW);
        
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
  const char* serverName = "http://192.168.43.42:3000/tomers";
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
    String timer = doc[i]["Variable"];
    String action = doc[i]["Condicion"];
    Serial.println(timer);
     Serial.println(action);
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
