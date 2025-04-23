#include <Wire.h>
#include "Adafruit_SGP40.h"

Adafruit_SGP40 sgp;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Serial.println("SGP40 Test");

  if (!sgp.begin()) {
    Serial.println("SGP40 nicht gefunden! Checke die Verkabelung.");
    while (1) delay(10);
  }
}

void loop() {
  uint16_t voc_index = sgp.measureRaw(0x8000);  // 0x8000 = default humidity compensation

  Serial.print("VOC Index: ");
  Serial.println(voc_index);

  delay(1000);
}
