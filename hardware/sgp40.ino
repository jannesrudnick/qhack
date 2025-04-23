#include <Wire.h>
#include "Adafruit_SGP40.h"
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid     = "uni-event";
const char* password = "Q-Summit2025!";
const char* serverUrl = "https://n8n.jannesrudnick.com/webhook/e1748a95-2e09-4e86-92b6-988ae4a93d1d";

void setup() {
  Serial.begin(115200);
  
  if (!sgp.begin()) {
    Serial.println("SGP40 nicht gefunden! Checke die Verkabelung.");
    while (1) delay(10);
  }

  Serial.println("WLAN verbinden...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nVerbunden mit WLAN!");
  Serial.print("IP Adresse: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  uint16_t voc_index = sgp.measureRaw(0x8000);  // 0x8000 = default humidity compensation

  Serial.print("VOC Index: ");
  Serial.println(voc_index);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);  // Ziel-URL
    http.addHeader("Content-Type", "application/json");

    // JSON-Body erstellen
    String jsonBody = "{\"voc\": " + String(voc_index, 2) + "}";

    int httpResponseCode = http.POST(jsonBody);

    if (httpResponseCode > 0) {
      Serial.println("Antwortcode: " + String(httpResponseCode));
      String response = http.getString();
      Serial.println("Antwort: " + response);
    } else {
      Serial.print("Fehler beim Senden: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  
  delay(1000);
}
