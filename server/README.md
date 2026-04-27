# CRM CasaGold - Backend API

Backend para el sistema CRM inmobiliario de CasaGold. Gestiona leads, categorías, etapas, estados y webhooks para integración con formularios externos.

## Características

- **Gestión de Leads**: CRUD completo con historial de cambios
- **Categorías**: Cada landing page tiene su propia categoría de leads
- **Etapas y Estados**: Funnel personalizable con múltiples estados por etapa
- **Webhooks**: Endpoints seguros para recibir leads desde formularios externos
- **Google Sheets**: Integración opcional para sincronización bidireccional
- **Seguimiento**: Fechas de inicio y deadlines por lead
- **Historial**: Auditoría completa de cambios de etapa/estado

## Instalación

```bash
cd server
npm install
```

## Configuración

1. Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Editar `.env` con tus configuraciones:
```
PORT=3001
DATABASE_PATH=./data/crm.db

# Google Sheets API (opcional)
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=id-de-tu-spreadsheet

# Webhook secret
FORM_WEBHOOK_SECRET=casagold2024secret
```

## Ejecución

### Desarrollo (auto-reload)
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints de la API

### Health Check
- `GET /api/health` - Verificar estado del servidor

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del dashboard

### Leads
- `GET /api/leads` - Listar todos los leads (con filtros: category, stage, search)
- `GET /api/leads/:id` - Obtener lead por ID con historial
- `POST /api/leads` - Crear nuevo lead
- `PUT /api/leads/:id` - Actualizar lead
- `DELETE /api/leads/:id` - Eliminar lead

### Categorías
- `GET /api/categories` - Listar categorías con conteo de leads
- `GET /api/categories/:id` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría (si no tiene leads)

### Etapas y Estados
- `GET /api/stages` - Listar etapas con sus estados
- `POST /api/stages` - Crear nueva etapa
- `PUT /api/stages/:id` - Actualizar etapa
- `POST /api/stages/:stageId/statuses` - Agregar estado a una etapa

### Webhooks
- `GET /api/webhooks/webhooks` - Listar webhooks configurados
- `POST /api/webhooks/webhooks` - Crear nuevo webhook
- `PUT /api/webhooks/webhooks/:id` - Activar/desactivar webhook
- `POST /api/webhooks/lead/:token` - Endpoint público para recibir leads

## Uso de Webhooks

### Crear un webhook para una landing page:

```bash
curl -X POST http://localhost:3001/api/webhooks/webhooks \
  -H "Content-Type: application/json" \
  -d '{"name": "Formulario Venta", "category_id": 1}'
```

Respuesta:
```json
{
  "success": true,
  "data": { "id": 1, "name": "Formulario Venta", "token": "wh_1234567890_abc123", ... },
  "webhook_url": "/api/webhooks/lead/wh_1234567890_abc123"
}
```

### Configurar formulario externo:

Configura tu formulario (Typeform, Google Forms, etc.) para enviar POST a:
```
https://tu-dominio.com/api/webhooks/lead/wh_1234567890_abc123
```

Body del request:
```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+51999999999",
  "notes": "Interesado en vender departamento en Miraflores",
  "source_url": "https://casagold.com/vender"
}
```

## Estructura de la Base de Datos

### Tablas principales:
- **categories**: Categorías de leads (Venta, Compra, Tasación, Alquiler)
- **stages**: Etapas del funnel (Nuevo, Contactado, Negociación, Visita, Cerrado, Perdido)
- **statuses**: Estados dentro de cada etapa
- **leads**: Leads principales con toda la información
- **lead_history**: Historial de cambios de etapa/estado
- **webhooks**: Configuración de webhooks para formularios externos
- **sheet_integrations**: Configuración de Google Sheets (opcional)

## Modelo de Datos Lead

```javascript
{
  id: number,
  name: string,
  email: string | null,
  phone: string,
  category_id: number,
  stage_id: number,
  status_id: number,
  source: 'manual' | 'webhook' | 'import',
  source_url: string | null,
  notes: string | null,
  start_date: datetime | null,
  deadline: datetime | null,
  assigned_to: string | null,
  created_at: datetime,
  updated_at: datetime
}
```

## Flujo Típico de un Lead

1. Lead llega desde formulario → Webhook crea lead en etapa "Nuevo Lead"
2. Agente contacta → Cambia a etapa "Contactado", estado "Respondió"
3. Se programa visita → Cambia a etapa "Visita Programada"
4. Visita completada → Cambia estado a "Completada"
5. Negociación → Cambia a etapa "En Negociación"
6. Cierre → Cambia a etapa "Cerrado", estado "Venta concretada"

Todo cambio queda registrado en `lead_history` para auditoría.
