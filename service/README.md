## Servicio Backend
Este servicio se encuentra alojado en Heroku, y es un servicio básico hecho en Nodejs, mediante el framework express.
---
### Endpoints
Es muy básico y tiene solamente dos endpoints

- POST https://pressure-temperature-logging.herokuapp.com/values
- GET [https://pressure-temperature-logging.herokuapp.com/values](https://pressure-temperature-logging.herokuapp.com/values)

El primero es para guardar la lectura tomada por el sensor mediante NodeMCU, y el otro es para leer la información para ser presentada en un dashboard simple hecho en React.
---
### PostgreSQL
Aqui manejo los datos con PostgreSQL, de esta manera no tenemos problemas con Heroku.