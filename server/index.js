import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/database.js';

// Importar rutas
import leadsRoutes from './routes/leads.js';
import categoriesRoutes from './routes/categories.js';
import stagesRoutes from './routes/stages.js';
import webhooksRoutes from './routes/webhooks.js';

// Cargar variables de entorno
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/leads', leadsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stages', stagesRoutes);
app.use('/api/webhooks', webhooksRoutes);

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CRM CasaGold API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para estadísticas del dashboard
app.get('/api/stats', (req, res) => {
  try {
    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
    const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage_id = (SELECT id FROM stages WHERE name = 'Nuevo Lead')").get().count;
    const contactedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage_id = (SELECT id FROM stages WHERE name = 'Contactado')").get().count;
    const negotiatingLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage_id = (SELECT id FROM stages WHERE name = 'En Negociacion')").get().count;
    const closedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage_id = (SELECT id FROM stages WHERE name = 'Cerrado')").get().count;
    const lostLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage_id = (SELECT id FROM stages WHERE name = 'Perdido')").get().count;
    
    const byCategory = db.prepare(`
      SELECT c.name, c.color, COUNT(l.id) as count
      FROM categories c
      LEFT JOIN leads l ON c.id = l.category_id
      GROUP BY c.id
    `).all();
    
    const recentLeads = db.prepare(`
      SELECT COUNT(*) as count FROM leads 
      WHERE created_at >= datetime('now', '-7 days')
    `).get().count;
    
    res.json({
      success: true,
      data: {
        total: totalLeads,
        by_stage: {
          new: newLeads,
          contacted: contactedLeads,
          negotiating: negotiatingLeads,
          closed: closedLeads,
          lost: lostLeads
        },
        by_category: byCategory,
        recent_leads: recentLeads
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint no encontrado' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Error interno del servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n  CRM CasaGold - Servidor Backend');
  console.log('  Puerto:', PORT);
  console.log('  URL: http://localhost:' + PORT);
  console.log('  API: http://localhost:' + PORT + '/api\n');
});
