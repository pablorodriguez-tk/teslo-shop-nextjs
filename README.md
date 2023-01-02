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
