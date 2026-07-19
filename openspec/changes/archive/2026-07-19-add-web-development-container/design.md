## Context

El repositorio dispone de un `docker-compose.yml` que construye el backend desde `server/Dockerfile.dev`, monta el código fuente en `/app` y no instala dependencias durante el build. El frontend React/Vite se ejecuta hoy directamente desde `client/`; su script `dev` ya escucha en `0.0.0.0:3000`, por lo que es compatible con la publicación de puertos desde un contenedor.

La imagen del frontend debe servir exclusivamente como bootstrap de desarrollo. El código y el resultado de `npm ci` seguirán procediendo del directorio `client` montado, de modo que reconstruir la imagen no sea necesario ante cambios de código o dependencias.

## Goals / Non-Goals

**Goals:**

- Ejecutar Vite mediante un servicio Compose llamado `web` y acceder a él desde el host en `http://localhost:3000`.
- Mantener el Dockerfile de desarrollo libre de pasos `COPY`, `npm install` y `npm ci`.
- Permitir instalar las dependencias de `client/package-lock.json` ejecutando `npm ci` dentro de un contenedor del servicio `web`.
- Mantener el hot reload mediante el montaje del árbol `client` en `/app`.
- Documentar un flujo reproducible de preparación y arranque.

**Non-Goals:**

- Crear una imagen optimizada de producción o servir un bundle estático.
- Cambiar la configuración funcional de Vite, la URL pública del backend o los contratos HTTP/Socket.IO.
- Automatizar la instalación de dependencias al construir o arrancar la imagen.
- Corregir hallazgos conocidos o modificar el servicio backend existente salvo lo necesario para documentar la convivencia de servicios.

## Decisions

### Dockerfile de bootstrap en `client/Dockerfile.dev`

La imagen se basará en Node.js 18 Alpine, fijará `/app` como directorio de trabajo, expondrá el puerto 3000 y usará `npm run dev` como comando. Se adopta la misma versión mayor y el mismo enfoque que `server/Dockerfile.dev` para evitar dos patrones de desarrollo distintos.

No se copiarán manifiestos ni se ejecutará `npm ci` durante el build. La alternativa de instalar dependencias en una capa de imagen ofrecería un primer arranque más directo, pero contradice el flujo solicitado y obligaría a reconstruir cuando cambie el lockfile.

### Servicio Compose `web` con bind mount

`web` se construirá desde `./client` usando `Dockerfile.dev`, montará `./client:/app`, habilitará terminal interactiva y publicará `3000:3000`. El bind mount permite que Vite observe los cambios locales y que un `npm ci` ejecutado mediante el servicio opere sobre el mismo árbol utilizado al arrancar.

Se conectará el servicio a la red Compose existente para mantener disponible la comunicación entre servicios si en el futuro se configura una URL interna. Sin embargo, no se cambiará el valor predeterminado de `VITE_API_URL`: el JavaScript se ejecuta en el navegador del host y seguirá alcanzando el backend publicado en `http://localhost:5000`.

La alternativa de un volumen nombrado exclusivo para `node_modules` aislaría mejor dependencias nativas del host, pero introduciría gestión de estado adicional y se apartaría del patrón actual del backend. Este cambio conservará el modelo existente de montaje completo del directorio.

### Instalación explícita antes del arranque útil

La documentación indicará ejecutar `docker compose run --rm web npm ci` antes de levantar el entorno por primera vez y cada vez que cambie `client/package-lock.json`. Después, `docker compose up --build` arrancará `web`, backend y MongoDB. La imagen puede construirse sin dependencias, pero Vite no estará disponible hasta completar ese paso, lo cual es una propiedad intencionada del flujo.

## Risks / Trade-offs

- [El servicio `web` termina o reinicia si faltan dependencias] → Documentar `npm ci` como prerrequisito explícito y proporcionar el comando exacto basado en Compose.
- [El bind mount hace que `node_modules` quede ligado al árbol de trabajo y al sistema de archivos compartido] → Mantener coherencia con el backend actual y recomendar reinstalar desde el contenedor cuando cambie el lockfile.
- [La detección de cambios puede variar según Docker Desktop y el host] → Usar el bind mount directo y el host `0.0.0.0` ya configurado; añadir opciones de polling solo si la validación demuestra que son necesarias.
- [El puerto 3000 puede estar ocupado en el host] → Documentar que `web` requiere ese puerto porque forma parte del contrato solicitado para acceso desde navegador.
