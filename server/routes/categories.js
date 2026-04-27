import { Router } from 'express';
import db from '../models/database.js';

const router = Router();

// Obtener todas las categorías
router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    
    // Obtener conteo de leads por categoría
    const leadCounts = db.prepare(`
      SELECT category_id, COUNT(*) as count
      FROM leads
      GROUP BY category_id
    `).all();
    
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      lead_count: leadCounts.find(lc => lc.category_id === cat.id)?.count || 0
    }));
    
    res.json({ success: true, data: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener una categoría por ID
router.get('/:id', (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear nueva categoría
router.post('/', (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nombre es requerido' });
    }
    
    const result = db.prepare(`
      INSERT INTO categories (name, description, color)
      VALUES (?, ?, ?)
    `).run(name, description || null, color || '#3B82F6');
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar categoría
router.put('/:id', (req, res) => {
  try {
    const { name, description, color } = req.body;
    const categoryId = req.params.id;
    
    const existingCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
    }
    
    db.prepare(`
      UPDATE categories 
      SET name = COALESCE(?, name), 
          description = COALESCE(?, description), 
          color = COALESCE(?, color)
      WHERE id = ?
    `).run(name, description, color, categoryId);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Eliminar categoría
router.delete('/:id', (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Verificar si hay leads asociados
    const leadCount = db.prepare('SELECT COUNT(*) as count FROM leads WHERE category_id = ?').get(categoryId);
    if (leadCount.count > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `No se puede eliminar: hay ${leadCount.count} leads asociados a esta categoría` 
      });
    }
    
    db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);
    
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
