#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
#include <ArduinoJson.h>

#include <WiFiClientSecureBearSSL.h>

#define BMP_SCK  (13)
#define BMP_MISO (12)
#define BMP_MOSI (11)
#define BMP_CS   (10)

#ifndef STASSID
#define STASSID "**" // Wifi Name
#define STAPSK  "**" // Wifi password
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

// Fingerprint for demo URL, expires on June 2, 2021, needs to be updated well before this date
const uint8_t fingerprint[20] = {0x40, 0xaf, 0x00, 0x6b, 0xec, 0x90, 0x22, 0x41, 0x8e, 0xa3, 0xad, 0xfa, 0x1a, 0xe8, 0x25, 0x41, 0x1d, 0x1a, 0x54, 0xb3};

//My app domain from heroku
const char* serverName = "https://pressure-temperature-logging.herokuapp.com/values";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
//unsigned long timerDelay = 5000;

Adafruit_BMP280 bmp; // I2C

void setup() {

  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 1);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  if (!bmp.begin()) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring!"));
    while (1);
  }

  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X1,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X1,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_OFF,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

  sendData();
  Serial.println("I'm going to sleep for 10 minutes, see ya!");
  ESP.deepSleep(600e6); // Deep sleep mode

}

void sendData() {
  if (WiFi.status() == WL_CONNECTED) {
      std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
      client->setInsecure();
      
      HTTPClient http;

      digitalWrite(LED_BUILTIN, 0);

      /**
       * Obtiene las lecturas de los
       * sensores
       */
      float temp = bmp.readTemperature();
      float pres = bmp.readPressure();
      float alt = bmp.readAltitude(1013.25);

      const int capacity = JSON_OBJECT_SIZE(2);
      StaticJsonDocument<capacity> doc;
      JsonObject obj = doc.to<JsonObject>();

      obj["temperature"] = temp;
      obj["pressure"]   = pres / 100;

      char output[128];
      serializeJson(doc, output);
      
      Serial.print("Se enviara el siguiente JSON: ");
      Serial.println(output);

      // Your Domain name with URL path or IP address with path
      http.begin(*client, serverName);
      Serial.print("Conectado a ");
      Serial.println(serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Accept", "application/json");

      int httpResponseCode = http.POST(output);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
      
      if (httpResponseCode == 201) {
        Serial.println("Datos enviados exitosamente al servidor");
      } else {
        Serial.println("No se pudo enviar los datos a Heroku");
      }

      digitalWrite(LED_BUILTIN, 1);
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}

void loop(void) {}