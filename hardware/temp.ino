#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define ONE_WIRE_BUS 2  // Pin für DS18B20 Data (z. B. GPIO 2)

const char* ssid     = "uni-event";
const char* password = "Q-Summit2025!";
const char* serverUrl = "https://n8n.jannesrudnick.com/webhook/e1748a95-2e09-4e86-92b6-988ae4a93d1d";

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

float lastValidTemp = 0.0; // letzter gültiger Temperaturwert


void setup() {
  Serial.begin(115200);
  sensors.begin();

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
  sensors.requestTemperatures(); 
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == -127.0) {
    tempC = lastValidTemp;
  } else {
    lastValidTemp = tempC; // neuen Wert speichern
  }
  Serial.print("Temperatur: ");
  Serial.print(tempC);
  Serial.println(" °C");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);  // Ziel-URL
    http.addHeader("Content-Type", "application/json");

    // JSON-Body erstellen
    String jsonBody = "{\"temperature\": " + String(tempC, 2) + "}";

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
