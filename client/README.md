## Share Videos Frontend

### Desarrollo

```bash
npm start
```

El cliente queda disponible en `http://localhost:3000` y, si no se configura otra
URL, consume la API local en `http://localhost:5000`.

### Variables de entorno

Vite solo expone las variables de cliente que comienzan por `VITE_`. Para apuntar
a otra API, configura `VITE_API_URL`, por ejemplo:

```env
VITE_API_URL=https://api.example.com
```

Configura esa misma variable en el proyecto de Vercel antes del siguiente despliegue.
