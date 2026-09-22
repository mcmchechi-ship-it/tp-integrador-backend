# Reflexiones técnicas — Parte 2

## 1. Elección de PostgreSQL y Sequelize

La consigna pide relaciones 1:1, 1:N y N:M. Una base relacional las expresa de forma natural con claves foráneas, restricciones `UNIQUE` y una tabla intermedia, y garantiza la integridad de los datos (no puede existir un proyecto sin responsable). Se usó **Sequelize 6** porque es la versión estable y documentada; la v7 sigue en desarrollo.

## 2. Diseño del modelo

Se eligió un dominio simple pero realista de "gestión de usuarios y datos":

- **Usuario ↔ Perfil (1:1):** los datos opcionales y de contacto se separan del usuario. La relación es 1:1 porque `usuarioId` en `perfiles` es `UNIQUE`; sin esa restricción sería 1:N.
- **Usuario → Proyectos (1:N):** un usuario es responsable de varios proyectos.
- **Proyectos ↔ Etiquetas (N:M):** un proyecto tiene varias etiquetas y una etiqueta sirve a varios proyectos, mediante `proyecto_etiquetas`.

El CRUD completo está implementado sobre **tres** entidades (usuarios, proyectos y etiquetas); la consigna pide al menos dos. El perfil se gestiona como recurso anidado (`/usuarios/:id/perfil`).

## 3. Arquitectura por capas

`routes → controllers → services → models`. Los controladores solo traducen HTTP; los servicios contienen las reglas (filtros, existencia de relaciones, transacciones); los modelos definen datos y validaciones. Así, en la Parte 3 se puede agregar autenticación como middleware sin tocar la lógica de datos.

## 4. Validaciones y manejo de errores

- **En el modelo:** formato de email, largo mínimo y máximo, valores permitidos de `rol` y `estado`, formato de teléfono y color.
- **En el servicio:** existencia del usuario responsable y de las etiquetas, y validación de cada filtro de la URL (`estado`, `rol`, `page`, `limit`, `orden`).
- **En el middleware de errores:** los errores de Sequelize se traducen a códigos HTTP: validación → 400, valor duplicado → 409, relación inexistente → 404, JSON mal formado → 400. Los errores 500 se registran en `log.txt`.

El campo `orden` se valida contra una lista blanca de columnas, de modo que no se pueda ordenar por campos como `password`.

## 4.1 Un problema de seguridad detectado durante las pruebas

Al probar el endpoint de creación se comprobó que aceptaba `"rol": "admin"` desde el cliente, lo que permitiría que cualquiera se registrara como administrador. Se corrigió: al crear un usuario el rol siempre es `usuario`, y solo se puede cambiar con `PUT`, que en la Parte 3 quedará protegido con JWT y permiso de administrador. Es un caso de *mass assignment*, y motivó que todos los servicios filtren los campos aceptados con una lista blanca.

## 5. Seguridad de las contraseñas

Se guardan cifradas con bcrypt (10 rondas de sal) mediante un hook del modelo, y el `defaultScope` excluye la columna `password` de cualquier consulta. Existe un scope `conPassword` para el login de la Parte 3. Se usó `bcryptjs` (JavaScript puro) en lugar de `bcrypt` para evitar problemas de compilación en Windows.

## 6. Transacciones y consistencia

Crear un usuario junto con su perfil se hace dentro de una transacción: si falla el perfil, no queda un usuario a medias. La consulta que devuelve el resultado se ejecuta después de confirmar la transacción.

## 7. Filtros y búsqueda dinámica

Los filtros se construyen a partir de los parámetros presentes en la URL y se pueden combinar (`q`, `estado`, `etiqueta`, `usuarioId`, `vencidos`). La búsqueda de texto usa `iLike`, propio de PostgreSQL. Los listados se paginan con un máximo de 50 elementos por página para evitar respuestas enormes.

## 8. Limitaciones conocidas y próximos pasos

- Aún **no hay autenticación**: cualquiera puede llamar a la API. Se resuelve en la Parte 3 con JWT y rutas protegidas.
- Se usa `sequelize.sync()` para crear tablas; en producción convendría usar migraciones.
- `npm audit` informa de una vulnerabilidad moderada en `uuid`, dependencia interna de Sequelize 6. No afecta al proyecto y la solución propuesta por npm (`--force`) degradaría Sequelize a la versión 3, por lo que se decidió no aplicarla.
- No hay pruebas automatizadas; las pruebas se hicieron con peticiones manuales (`docs/pruebas.http`).
