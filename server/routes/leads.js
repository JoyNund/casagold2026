import { Router } from 'express';
import db from '../models/database.js';

const router = Router();

// Obtener todos los leads con sus relaciones
router.get('/', (req, res) => {
  try {
    const { category, stage, search, sortBy = 'created_at', order = 'DESC' } = req.query;
    
    let query = `
      SELECT 
        l.id, l.name, l.email, l.phone, l.notes, l.start_date, l.deadline, l.assigned_to, l.source, l.source_url,
        l.created_at, l.updated_at,
        c.id as category_id, c.name as category_name, c.color as category_color,
        s.id as stage_id, s.name as stage_name, s.color as stage_color,
        st.id as status_id, st.name as status_name, st.color as status_color
      FROM leads l
      JOIN categories c ON l.category_id = c.id
      JOIN stages s ON l.stage_id = s.id
      JOIN statuses st ON l.status_id = st.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      query += ' AND l.category_id = ?';
      params.push(category);
    }
    
    if (stage) {
      query += ' AND l.stage_id = ?';
      params.push(stage);
    }
    
    if (search) {
      query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
      const searchTerm = '%' + search + '%';
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY l.' + sortBy + ' ' + order;
    
    const leads = db.prepare(query).all(...params);
    
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener un lead por ID
router.get('/:id', (req, res) => {
  try {
    const lead = db.prepare(`
      SELECT 
        l.*, 
        c.name as category_name, c.color as category_color,
        s.name as stage_name, s.color as stage_color,
        st.name as status_name, st.color as status_color
      FROM leads l
      JOIN categories c ON l.category_id = c.id
      JOIN stages s ON l.stage_id = s.id
      JOIN statuses st ON l.status_id = st.id
      WHERE l.id = ?
    `).get(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead no encontrado' });
    }
    
    const history = db.prepare(`
      SELECT 
        h.*,
        old_s.name as old_stage_name,
        new_s.name as new_stage_name,
        old_st.name as old_status_name,
        new_st.name as new_status_name
      FROM lead_history h
      LEFT JOIN stages old_s ON h.old_stage_id = old_s.id
      LEFT JOIN stages new_s ON h.new_stage_id = new_s.id
      LEFT JOIN statuses old_st ON h.old_status_id = old_st.id
      LEFT JOIN statuses new_st ON h.new_status_id = new_st.id
      WHERE h.lead_id = ?
      ORDER BY h.created_at DESC
    `).all(req.params.id);
    
    res.json({ success: true, data: { ...lead, history } });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear nuevo lead
router.post('/', (req, res) => {
  try {
    const { name, email, phone, category_id, notes, source = 'manual', source_url, start_date, deadline, assigned_to } = req.body;
    
    if (!name || !phone || !category_id) {
      return res.status(400).json({ success: false, error: 'Nombre, teléfono y categoría son requeridos' });
    }
    
    const defaultStage = db.prepare("SELECT id FROM stages WHERE name = 'Nuevo Lead'").get();
    const defaultStatus = db.prepare("SELECT id FROM statuses WHERE stage_id = ? AND name = 'Sin contactar'").get(defaultStage?.id);
    
    if (!defaultStage || !defaultStatus) {
      return res.status(500).json({ success: false, error: 'Configuración de etapas incompleta' });
    }
    
    const result = db.prepare(`
      INSERT INTO leads (name, email, phone, category_id, stage_id, status_id, notes, source, source_url, start_date, deadline, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email || null, phone, category_id, defaultStage.id, defaultStatus.id, notes || null, source, source_url || null, start_date || null, deadline || null, assigned_to || null);
    
    db.prepare(`
      INSERT INTO lead_history (lead_id, new_stage_id, new_status_id, changed_by, notes)
      VALUES (?, ?, ?, 'system', 'Lead creado')
    `).run(result.lastInsertRowid, defaultStage.id, defaultStatus.id);
    
    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar lead
router.put('/:id', (req, res) => {
  try {
    const { name, email, phone, category_id, stage_id, status_id, notes, start_date, deadline, assigned_to } = req.body;
    const leadId = req.params.id;
    
    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    if (!existingLead) {
      return res.status(404).json({ success: false, error: 'Lead no encontrado' });
    }
    
    const stageChanged = stage_id && stage_id !== existingLead.stage_id;
    const statusChanged = status_id && status_id !== existingLead.status_id;
    
    const updateFields = [];
    const updateValues = [];
    
    if (name) { updateFields.push('name = ?'); updateValues.push(name); }
    if (email !== undefined) { updateFields.push('email = ?'); updateValues.push(email); }
    if (phone) { updateFields.push('phone = ?'); updateValues.push(phone); }
    if (category_id) { updateFields.push('category_id = ?'); updateValues.push(category_id); }
    if (stage_id) { updateFields.push('stage_id = ?'); updateValues.push(stage_id); }
    if (status_id) { updateFields.push('status_id = ?'); updateValues.push(status_id); }
    if (notes !== undefined) { updateFields.push('notes = ?'); updateValues.push(notes); }
    if (start_date !== undefined) { updateFields.push('start_date = ?'); updateValues.push(start_date); }
    if (deadline !== undefined) { updateFields.push('deadline = ?'); updateValues.push(deadline); }
    if (assigned_to !== undefined) { updateFields.push('assigned_to = ?'); updateValues.push(assigned_to); }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(leadId);
    
    db.prepare('UPDATE leads SET ' + updateFields.join(', ') + ' WHERE id = ?').run(...updateValues);
    
    if (stageChanged || statusChanged) {
      db.prepare(`
        INSERT INTO lead_history (lead_id, old_stage_id, new_stage_id, old_status_id, new_status_id, changed_by)
        VALUES (?, ?, ?, ?, ?, 'user')
      `).run(leadId, stageChanged ? existingLead.stage_id : null, stage_id || existingLead.stage_id, statusChanged ? existingLead.status_id : null, status_id || existingLead.status_id);
    }
    
    const updatedLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    res.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Eliminar lead
router.delete('/:id', (req, res) => {
  try {
    const leadId = req.params.id;
    
    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
    if (!existingLead) {
      return res.status(404).json({ success: false, error: 'Lead no encontrado' });
    }
    
    db.prepare('DELETE FROM leads WHERE id = ?').run(leadId);
    
    res.json({ success: true, message: 'Lead eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
