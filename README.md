# Next.js Teslo Shop App

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d, significa que se corre en background (en segundo plano)

* MongoDB URL Local

```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

Renombar el archivo **.env.example** a **.env** y configurar las variables de entorno

- Reconstruir los modulos de node y levantar el servidor

```
npm install
npm run dev
```

## Llenar la base de datos con información de pruebas

Llamar a

```
http://localhost:3000/api/seed
```

## Si estamos en desarrollo usando docker solo para db, ejecutar, ademas de tener las variables de entorno configuradas

```
1) Completar las variables de entorno en el archivo .env
--- MONGO_URL=mongodb://localhost:27017/teslodb
2) docker compose up -d
3) npm run dev
4) http://localhost:3000
```

## Si estamos en desarrollo con docker, ejecutar, ademas de tener las variables de entorno configuradas

```
1) Completar las variables de entorno en el archivo .env
--- MONGO_URL=mongodb://teslo-database-dev:27017/teslodb
2) docker compose -f docker-compose.dev.yml build
3) docker compose -f docker-compose.dev.yml up -d
```

## Si estamos en produccion, ejecutar, ademas de tener las variables de entorno configuradas

```
1) Completar las variables de entorno en el archivo .env
MONGO_URL=<String de conexion de produccion>
2) docker compose -f docker-compose.prod.yml build
3) docker compose -f docker-compose.prod.yml up -d
```

## Usuario de prueba de Paypal para realizar compras en el sitio

```
Usuario: sb-stqd323912467@personal.example.com
Password: 123456789
```

## [Information for testing Pays](https://developer.paypal.com/tools/sandbox/card-testing/)

## Tarjeta de credito de prueba

```
Numero: 371449635398431
```

## [Live Site](https://shop.pablorodriguez.com.ar/)

![Teslo-Shop-App](https://res.cloudinary.com/drcq2kx3u/image/upload/v1675482851/GitHub/NextJs-Teslo/next-js-teslo.png)
