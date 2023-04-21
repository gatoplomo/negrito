

uint8_t GPIO_Pin = D8;
void setup() 
{
}
void loop() 
{
  //generar tono de 440Hz durante 1000 ms
  tone(GPIO_Pin, 440);
  delay(1000);
  //detener tono durante 500ms  
  noTone(GPIO_Pin);
  delay(500);
  //generar tono de 523Hz durante 500ms, y detenerlo durante 500ms.
  tone(GPIO_Pin, 523, 300);
  delay(500);
}
