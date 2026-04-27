# Implementación CRM CasaGold

## Resumen de Cambios

### 1. Eliminación de Referencia a Gemini AI
- Se eliminó la configuración `GEMINI_API_KEY` del `vite.config.ts`
- El proyecto ahora funciona sin dependencias de IA

### 2. Backend Node.js + Express Implementado

Se creó un servidor backend completo para el CRM inmobiliario en `/workspace/server/`

#### Estructura del Backend
```
server/
├── index.js              # Punto de entrada principal
├── package.json          # Dependencias y scripts
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de configuración
├── README.md             # Documentación completa
├── data/                 # Base de datos SQLite (auto-generada)
├── models/
│   └── database.js       # Configuración de BD y tablas
├── routes/
│   ├── leads.js          # Endpoints para leads
│   ├── categories.js     # Endpoints para categorías
│   ├── stages.js         # Endpoints para etapas/estados
│   └── webhooks.js       # Endpoints para webhooks
└── services/             # (para futuros servicios)
```

#### Características Principales

**1. Gestión de Leads por Categorías**
- Cada landing page tiene su propia categoría (Venta, Compra, Tasación, Alquiler)
- Los leads se clasifican automáticamente según el formulario de origen
- Campos: nombre, email, teléfono, categoría, etapa, estado, notas, fechas, asignado

**2. Funnel CRM con Etapas y Estados**
- 6 etapas predefinidas: Nuevo Lead → Contactado → En Negociación → Visita Programada → Cerrado → Perdido
- Múltiples estados por etapa (ej: "Sin contactar", "Intentando contacto" en Nuevo Lead)
- Historial completo de cambios de etapa/estado

**3. Webhooks para Formularios Externos**
- Endpoints seguros con token único para cada formulario
- Compatible con Typeform, Google Forms, Zapier, etc.
- Creación automática de leads desde cualquier fuente externa

**4. Integración con Google Sheets (Opcional)**
- Tabla preparada para sincronización con Google Sheets
- Importación de leads desde hojas de cálculo en tiempo real
- Requiere configuración de Service Account

**5. Seguimiento con Fechas**
- `start_date`: Fecha de inicio del seguimiento
- `deadline`: Fecha límite para cerrar el lead
- Alertas visuales para leads próximos a vencer

#### Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check del servidor |
| GET | `/api/stats` | Estadísticas del dashboard |
| GET | `/api/leads` | Listar leads (filtros: category, stage, search) |
| GET | `/api/leads/:id` | Obtener lead con historial |
| POST | `/api/leads` | Crear nuevo lead |
| PUT | `/api/leads/:id` | Actualizar lead |
| DELETE | `/api/leads/:id` | Eliminar lead |
| GET | `/api/categories` | Listar categorías con conteo |
| POST | `/api/categories` | Crear categoría |
| GET | `/api/stages` | Listar etapas con estados |
| POST | `/api/stages/:stageId/statuses` | Agregar estado |
| GET | `/api/webhooks/webhooks` | Listar webhooks |
| POST | `/api/webhooks/webhooks` | Crear webhook |
| POST | `/api/webhooks/lead/:token` | Recibir lead desde formulario |

#### Ejemplos de Uso

**Crear Lead Manualmente:**
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@email.com",
    "phone": "+51987654321",
    "category_id": 1,
    "notes": "Quiere vender casa en San Isidro",
    "start_date": "2024-01-15",
    "deadline": "2024-02-15"
  }'
```

**Crear Webhook para Formulario:**
```bash
curl -X POST http://localhost:3001/api/webhooks/webhooks \
  -H "Content-Type: application/json" \
  -d '{"name": "Form Landing Venta", "category_id": 1}'
```

Respuesta incluye URL única: `/api/webhooks/lead/wh_1234567890_abc`

**Configurar Formulario Externo:**
Apuntar el POST del formulario a:
```
https://tu-api.com/api/webhooks/lead/wh_1234567890_abc
```

Body esperado:
```json
{
  "name": "Cliente Nombre",
  "email": "cliente@email.com", 
  "phone": "+51999999999",
  "notes": "Mensaje opcional",
  "source_url": "https://casagold.com/vender"
}
```

### 3. Configuración del Proxy en Vite

El `vite.config.ts` ahora incluye proxy para desarrollo:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
  },
}
```

Esto permite que el frontend llame a `/api/...` y sea redirigido al backend.

## Cómo Ejecutar el Proyecto

### Terminal 1 - Backend:
```bash
cd /workspace/server
npm install
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd /workspace
npm install
npm run dev
```

## Próximos Pasos Recomendados

1. **Frontend del CRM**: Crear dashboard React para gestionar leads
2. **Importación Google Sheets**: Implementar servicio de sincronización
3. **Autenticación**: Agregar login para múltiples usuarios
4. **Notificaciones**: Emails/alertas para deadlines próximos
5. **Reportes**: Dashboard con métricas de conversión

## Base de Datos

Ubicación: `/workspace/server/data/crm.db`

Tablas principales:
- `categories`: Categorías de leads
- `stages`: Etapas del funnel
- `statuses`: Estados por etapa  
- `leads`: Leads principales
- `lead_history`: Auditoría de cambios
- `webhooks`: Configuración de webhooks
- `sheet_integrations`: Integraciones Google Sheets

## Seguridad

- Tokens únicos por webhook
- Validación de datos en todos los endpoints
- CORS configurado para desarrollo
- Variables sensibles en `.env`
