import { Router } from 'express';
import db from '../models/database.js';

const router = Router();

// Endpoint para recibir leads desde formularios externos (webhooks)
router.post('/lead/:token', (req, res) => {
  try {
    const { token } = req.params;
    
    // Verificar token del webhook
    const webhook = db.prepare('SELECT * FROM webhooks WHERE token = ? AND active = true').get(token);
    
    if (!webhook) {
      return res.status(401).json({ success: false, error: 'Token inválido o webhook inactivo' });
    }
    
    const { name, email, phone, notes, source_url, start_date, deadline } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Nombre y teléfono son requeridos' });
    }
    
    // Obtener etapa y estado por defecto
    const defaultStage = db.prepare('SELECT id FROM stages WHERE name = "Nuevo Lead"').get();
    const defaultStatus = db.prepare('SELECT id FROM statuses WHERE stage_id = ? AND name = "Sin contactar"').get(defaultStage?.id);
    
    if (!defaultStage || !defaultStatus) {
      return res.status(500).json({ success: false, error: 'Configuración incompleta' });
    }
    
    // Crear lead
    const result = db.prepare(`
      INSERT INTO leads (name, email, phone, category_id, stage_id, status_id, notes, source, source_url, start_date, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'webhook', ?, ?, ?)
    `).run(name, email || null, phone, webhook.category_id, defaultStage.id, defaultStatus.id, notes || null, source_url || null, start_date || null, deadline || null);
    
    // Registrar en historial
    db.prepare(`
      INSERT INTO lead_history (lead_id, new_stage_id, new_status_id, changed_by, notes)
      VALUES (?, ?, ?, 'webhook', 'Lead creado desde formulario externo')
    `).run(result.lastInsertRowid, defaultStage.id, defaultStatus.id);
    
    console.log(`Nuevo lead recibido desde webhook: ${name}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Lead creado exitosamente',
      lead_id: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear nuevo webhook
router.post('/webhooks', (req, res) => {
  try {
    const { name, category_id, active = true } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({ success: false, error: 'Nombre y categoría son requeridos' });
    }
    
    // Generar token único
    const token = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const result = db.prepare(`
      INSERT INTO webhooks (name, token, category_id, active)
      VALUES (?, ?, ?, ?)
    `).run(name, token, category_id, active);
    
    const webhook = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ 
      success: true, 
      data: webhook,
      webhook_url: `/api/webhooks/lead/${token}`
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los webhooks
router.get('/webhooks', (req, res) => {
  try {
    const webhooks = db.prepare(`
      SELECT w.*, c.name as category_name
      FROM webhooks w
      JOIN categories c ON w.category_id = c.id
      ORDER BY w.created_at DESC
    `).all();
    
    res.json({ success: true, data: webhooks });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Activar/desactivar webhook
router.put('/webhooks/:id', (req, res) => {
  try {
    const { active } = req.body;
    const webhookId = req.params.id;
    
    db.prepare('UPDATE webhooks SET active = ? WHERE id = ?').run(active ? 1 : 0, webhookId);
    
    const webhook = db.prepare('SELECT * FROM webhooks WHERE id = ?').get(webhookId);
    
    res.json({ success: true, data: webhook });
  } catch (error) {
    console.error('Error updating webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
