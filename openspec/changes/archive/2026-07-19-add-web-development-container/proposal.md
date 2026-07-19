## Why

El frontend solo puede ejecutarse actualmente desde el host, mientras que el backend y MongoDB ya disponen de un flujo de desarrollo con Docker Compose. Incorporar el frontend al mismo entorno permite abrir la aplicación en `http://localhost:3000` sin instalar Node.js directamente para arrancarla, manteniendo la instalación explícita de dependencias dentro del contenedor.

## What Changes

- Añadir una imagen de desarrollo del frontend cuyo Dockerfile se limite a preparar el entorno y arrancar Vite, sin copiar el código ni instalar dependencias durante el build.
- Añadir a Docker Compose un servicio llamado `web` que monte el directorio `client`, publique el puerto 3000 y ejecute la aplicación de desarrollo.
- Mantener `npm ci` como paso manual dentro de un contenedor del servicio `web`, siguiendo el flujo existente del backend.
- Documentar la preparación, el arranque y el acceso al entorno Docker de desarrollo completo.

## Capabilities

### New Capabilities

- `frontend-development-container`: Define el entorno Docker de desarrollo del frontend, su servicio Compose, el acceso por navegador y la instalación manual de dependencias.

### Modified Capabilities

Ninguna.

## Impact

- Se añadirán o modificarán archivos de infraestructura en `client/` y `docker-compose.yml`.
- Se actualizará `docs/development.md` con el flujo de instalación y arranque mediante Docker Compose.
- No cambian las APIs HTTP, los eventos Socket.IO, la persistencia ni el comportamiento funcional de las salas.
- La solución reutilizará la versión de Node.js adoptada por el proyecto y las dependencias ya declaradas en `client/package-lock.json`; el build de la imagen no descargará paquetes npm.
