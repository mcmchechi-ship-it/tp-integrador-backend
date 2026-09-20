# Reflexiones técnicas — Parte 1

## 1. Node.js y Express

Node.js es un entorno de ejecución de JavaScript fuera del navegador, basado en el motor V8 y con un modelo de E/S no bloqueante orientado a eventos. Se usa para APIs, servidores web, herramientas de línea de comandos y servicios en tiempo real.

Con Node "puro" (`http.createServer`) hay que analizar la URL, el método y el body manualmente. Express aporta enrutamiento declarativo (`router.get('/status', ...)`), una cadena de middlewares (`next()`), servicio de estáticos (`express.static`), integración con motores de vistas y manejo centralizado de errores. El resultado es menos código repetitivo y una estructura fácil de escalar.

## 2. Flujo servidor–cliente

Ver el diagrama de secuencia en el README: el cliente envía una petición HTTP, Express intenta primero resolverla como archivo estático, luego la pasa por los middlewares (registro de visitas), después llega al router y al controlador, que devuelve HTML o JSON. Si ninguna ruta coincide, responde el middleware 404.

## 3. Stack técnico

Node.js ≥ 18 · Express · EJS · dotenv · nodemon (dev) · módulo `fs` · Git/GitHub. En las siguientes partes: PostgreSQL o MongoDB, Sequelize o Mongoose, JWT, Multer.

## 4. Decisiones pensando en escalabilidad

- Separar `index.js` (arranque) de `app.js` (configuración) permitirá conectar la base de datos antes de escuchar y facilitará pruebas.
- Las carpetas `routes/controllers/services/middlewares` ya reflejan la arquitectura modular exigida; en la Parte 2 se sumarán `models/` y `config/`, y en la Parte 3 el middleware de autenticación JWT y el de subida de archivos.
- El logger en archivo plano está aislado en un servicio, por lo que podría reemplazarse por una librería (winston, pino) sin tocar los controladores.

## 5. Limitaciones conocidas

- `log.txt` crece sin límite; en producción se necesitaría rotación de logs.
- No se registran los archivos estáticos en el log (los atiende `express.static` antes del middleware), decisión deliberada para no llenar el archivo de ruido.
