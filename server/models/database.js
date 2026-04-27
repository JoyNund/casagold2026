import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/crm.db');

// Crear directorio de datos si no existe
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Crear tablas
db.exec(`
  -- Categorías de leads (cada landing page es una categoría)
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Etapas del funnel CRM
  CREATE TABLE IF NOT EXISTS stages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    order_index INTEGER NOT NULL,
    color TEXT DEFAULT '#6B7280',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Estados dentro de cada etapa
  CREATE TABLE IF NOT EXISTS statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stage_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#9CA3AF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
  );

  -- Leads principales
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    stage_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    source TEXT DEFAULT 'manual',
    source_url TEXT,
    notes TEXT,
    start_date DATETIME,
    deadline DATETIME,
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE RESTRICT,
    FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE RESTRICT
  );

  -- Historial de cambios de etapa/estado
  CREATE TABLE IF NOT EXISTS lead_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    old_stage_id INTEGER,
    new_stage_id INTEGER,
    old_status_id INTEGER,
    new_status_id INTEGER,
    changed_by TEXT DEFAULT 'system',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
  );

  -- Configuración de integración con Google Sheets
  CREATE TABLE IF NOT EXISTS sheet_integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sheet_id TEXT NOT NULL,
    sheet_name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    sync_enabled BOOLEAN DEFAULT true,
    last_sync DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Webhooks para formularios externos
  CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  -- Índices para mejor performance
  CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category_id);
  CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage_id);
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_id);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_lead_history_lead ON lead_history(lead_id);
`);

// Datos iniciales por defecto
const initDefaultData = () => {
  // Categorías por defecto
  const defaultCategories = [
    { name: 'Venta de Propiedad', description: 'Leads que quieren vender', color: '#10B981' },
    { name: 'Compra de Propiedad', description: 'Leads que quieren comprar', color: '#3B82F6' },
    { name: 'Tasación Gratuita', description: 'Leads de tasación', color: '#F59E0B' },
    { name: 'Alquiler', description: 'Leads de alquiler', color: '#8B5CF6' },
  ];

  for (const cat of defaultCategories) {
    try {
      db.prepare('INSERT OR IGNORE INTO categories (name, description, color) VALUES (?, ?, ?)').run(cat.name, cat.description, cat.color);
    } catch (e) {
      console.log(`Categoría ya existe: ${cat.name}`);
    }
  }

  // Etapas del funnel
  const defaultStages = [
    { name: 'Nuevo Lead', order_index: 0, color: '#3B82F6' },
    { name: 'Contactado', order_index: 1, color: '#10B981' },
    { name: 'En Negociación', order_index: 2, color: '#F59E0B' },
    { name: 'Visita Programada', order_index: 3, color: '#8B5CF6' },
    { name: 'Cerrado', order_index: 4, color: '#EF4444' },
    { name: 'Perdido', order_index: 5, color: '#6B7280' },
  ];

  for (const stage of defaultStages) {
    try {
      db.prepare('INSERT OR IGNORE INTO stages (name, order_index, color) VALUES (?, ?, ?)').run(stage.name, stage.order_index, stage.color);
    } catch (e) {
      console.log(`Etapa ya existe: ${stage.name}`);
    }
  }

  // Estados por etapa
  const defaultStatuses = [
    { stage: 'Nuevo Lead', name: 'Sin contactar', color: '#3B82F6' },
    { stage: 'Nuevo Lead', name: 'Intentando contacto', color: '#60A5FA' },
    { stage: 'Contactado', name: 'Respondió', color: '#10B981' },
    { stage: 'Contactado', name: 'No responde', color: '#FCD34D' },
    { stage: 'En Negociación', name: 'Propuesta enviada', color: '#F59E0B' },
    { stage: 'En Negociación', name: 'Contrarrevisión', color: '#FBBF24' },
    { stage: 'Visita Programada', name: 'Programada', color: '#8B5CF6' },
    { stage: 'Visita Programada', name: 'Completada', color: '#A78BFA' },
    { stage: 'Cerrado', name: 'Venta concretada', color: '#EF4444' },
    { stage: 'Cerrado', name: 'Alquiler firmado', color: '#F87171' },
    { stage: 'Perdido', name: 'No interesado', color: '#6B7280' },
    { stage: 'Perdido', name: 'Compró otro', color: '#9CA3AF' },
  ];

  for (const status of defaultStatuses) {
    const stage = db.prepare('SELECT id FROM stages WHERE name = ?').get(status.stage);
    if (stage) {
      try {
        db.prepare('INSERT OR IGNORE INTO statuses (stage_id, name, color) VALUES (?, ?, ?)').run(stage.id, status.name, status.color);
      } catch (e) {
        console.log(`Estado ya existe: ${status.name}`);
      }
    }
  }

  console.log('Datos iniciales cargados correctamente');
};

initDefaultData();

export default db;
