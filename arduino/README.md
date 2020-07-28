# NodeMCU (ESP8266) y BMP280 ##
La parte del hardware de este proyecto esta compuesto por un NodeMCU basado en el popular ESP8266, y el elemento encargado de tomar las lecturas del medio ambiente es un BMP280.
![NodeMCU Edge Sensor](https://drive.google.com/file/d/1Wph26aK7DF4ZBxoyj_Wlk_zRTXpHRilp/view)
## Codigo fuente ##
Las tareas que realiza el NodeMCU es primeramente conectarse a la red WiFi, posteriormente configura el sensor BMP280 para comunicarse con el mediante el protocolo I2C.
Luego de esto, toma la muestra, realiza una conversion básica y envia los datos por POST en formato JSON al servidor en Heroku.
Este proceso se lleva a cabo cada 10 minutos o lo que se configure en los parametros del NodeMCU.
### Deep Sleep Mode ###
Al momento de terminar la lectura y enviar los datos exitosamente, el NodeMCU entra en modo Deep Sleep, para ahorrar bateria por unos cuantos meses (dependiendo la bateria de alimentación).