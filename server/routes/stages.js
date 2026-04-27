import { Router } from 'express';
import db from '../models/database.js';

const router = Router();

// Obtener todas las etapas con sus estados
router.get('/', (req, res) => {
  try {
    const stages = db.prepare('SELECT * FROM stages ORDER BY order_index').all();
    
    const stagesWithStatuses = stages.map(stage => {
      const statuses = db.prepare('SELECT * FROM statuses WHERE stage_id = ? ORDER BY name').all(stage.id);
      return { ...stage, statuses };
    });
    
    res.json({ success: true, data: stagesWithStatuses });
  } catch (error) {
    console.error('Error fetching stages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear nueva etapa
router.post('/', (req, res) => {
  try {
    const { name, order_index, color } = req.body;
    
    if (!name || order_index === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y orden son requeridos' });
    }
    
    const result = db.prepare(`
      INSERT INTO stages (name, order_index, color)
      VALUES (?, ?, ?)
    `).run(name, order_index, color || '#6B7280');
    
    const stage = db.prepare('SELECT * FROM stages WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ success: true, data: stage });
  } catch (error) {
    console.error('Error creating stage:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar etapa
router.put('/:id', (req, res) => {
  try {
    const { name, order_index, color } = req.body;
    const stageId = req.params.id;
    
    const existingStage = db.prepare('SELECT * FROM stages WHERE id = ?').get(stageId);
    if (!existingStage) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }
    
    db.prepare(`
      UPDATE stages 
      SET name = COALESCE(?, name), 
          order_index = COALESCE(?, order_index), 
          color = COALESCE(?, color)
      WHERE id = ?
    `).run(name, order_index, color, stageId);
    
    const stage = db.prepare('SELECT * FROM stages WHERE id = ?').get(stageId);
    res.json({ success: true, data: stage });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agregar estado a una etapa
router.post('/:stageId/statuses', (req, res) => {
  try {
    const { stageId } = req.params;
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nombre es requerido' });
    }
    
    const stage = db.prepare('SELECT * FROM stages WHERE id = ?').get(stageId);
    if (!stage) {
      return res.status(404).json({ success: false, error: 'Etapa no encontrada' });
    }
    
    const result = db.prepare(`
      INSERT INTO statuses (stage_id, name, color)
      VALUES (?, ?, ?)
    `).run(stageId, name, color || '#9CA3AF');
    
    const status = db.prepare('SELECT * FROM statuses WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ success: true, data: status });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
