
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);

#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
 
//Declaremos los pines CE y el CSN
#define CE_PIN 0
#define CSN_PIN 1
#define SCK 13
#define MQ2pin A0


//creamos el objeto radio (NRF24L01)
RF24 radio(CE_PIN, CSN_PIN);
byte direccion[5] ={'c','a','n','a','l'};


void setup() {
   // Inicializar el LCD
  lcd.init();
  

  //Encender la luz de fondo.
  lcd.backlight();
  
 lcd.setCursor (1,1) ;
 lcd.print("CONECTANDO");

lcd.clear();

  //inicializamos el NRF24L01 
  radio.begin();
 
//Abrimos un canal de escritura
 radio.openWritingPipe(direccion);


}

//vector con los datos a enviar
float datos[3];

int periodo = 5000;
unsigned long TiempoAhora = 0;
float sensorValue; 
void loop()
{ 

if(millis() > TiempoAhora + periodo){
 //cargamos los datos en la variable datos[]

  sensorValue = analogRead(MQ2pin); // read analog input pin 0
 datos[0]=sensorValue;
 datos[1]=20;
 datos[2]=3.14;
 //enviamos los datos
 bool ok = radio.write(datos, sizeof(datos));
  //reportamos por el puerto serial los datos enviados 
  if(ok)
  {
     Serial.print("Datos enviados: "); 
     Serial.print(datos[0]); 
     Serial.print(" , "); 
     Serial.print(datos[1]); 
     Serial.print(" , "); 
     Serial.println(datos[2]); 
  }
  else
  {
     Serial.println("no se ha podido enviar");
  }
   TiempoAhora = millis();
    }
  
 
}
