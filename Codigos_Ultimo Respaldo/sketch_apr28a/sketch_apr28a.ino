//#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include <SimpleDHT.h>

#define DHTPIN 25     // Pin del Attiny88 conectado al DHT11
#define DHTTYPE DHT11 // Tipo de sensor DHT11

SimpleDHT11 dht11(DHTPIN);
int fahrenheit;
int temperatureC;

#define MQ2pin 0

//LiquidCrystal_I2C lcd(0x27, 20, 4);

// Declaración de los pines CE y CSN
#define CE_PIN 0
#define CSN_PIN 1

// Creación del objeto radio (NRF24L01)
RF24 radio(CE_PIN, CSN_PIN);

const byte addresses[][6] = {"00001", "00002"};

struct Datos {
  float dato0;
  float dato1;
  float dato2;
  float dato3;
  float dato4;
};

Datos datos;

int button_stateB;

void setup() {
 //lcd.init();
 //lcd.backlight();
  radio.begin();
  radio.openWritingPipe(addresses[1]);
  radio.openReadingPipe(1, addresses[0]);
  radio.setPALevel(RF24_PA_MIN);
  pinMode(5,OUTPUT);
  pinMode(6,OUTPUT);
 pinMode(15,INPUT);

}


void loop() {

 //lcd.setCursor(0, 0);
 // lcd.print("Dato recibido: ");
 // lcd.setCursor(0, 1);
  //lcd.print(digitalRead(15));

  byte temperature = 0;
  byte humidity = 0;
  int result = dht11.read(&temperature, &humidity, NULL);

  if (result == SimpleDHTErrSuccess) {
    datos.dato1 = temperature;
    datos.dato2 = humidity;
  }

  datos.dato0 = analogRead(MQ2pin);
  
  byte pin6State = digitalRead(15);

  datos.dato3 = button_stateB;
  datos.dato4 = pin6State;

  radio.stopListening();
  
  radio.write(&datos, sizeof(datos));
  radio.startListening();

  if (radio.available()) {
    radio.read(&button_stateB, sizeof(button_stateB));
 
    if (button_stateB == 10) {
      digitalWrite(5, HIGH);
      digitalWrite(6, HIGH);
    } else if (button_stateB == 20) {
      digitalWrite(5, LOW);
      digitalWrite(6, HIGH);
    } else if (button_stateB == 30) {
      digitalWrite(5, HIGH);
      digitalWrite(6, LOW);
    } else if (button_stateB == 40) {
      digitalWrite(5, LOW);
      digitalWrite(6, LOW);
    }
  }

  delay(1000);
}
