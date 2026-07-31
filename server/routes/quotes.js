import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected by JWT token authentication
router.use(authenticateToken);

// GET all quotes of the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT id, quote_number, title, client_name, client_attention, items, condiciones, cierre, emisor, subtotal, descuento, igv, total, created_at, updated_at FROM quotes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// GET a specific quote by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quotes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// POST create a new quote
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      quote_number,
      title,
      client_name,
      client_attention,
      items,
      condiciones,
      cierre,
      emisor,
      subtotal,
      descuento = 0,
      igv,
      total
    } = req.body;

    if (!quote_number || !title || !client_name || !items || !condiciones || !cierre || !emisor) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if quote_number already exists
    const duplicateCheck = await pool.query(
      'SELECT id FROM quotes WHERE quote_number = $1',
      [quote_number]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ error: `Quote number ${quote_number} already exists` });
    }

    const result = await pool.query(
      `INSERT INTO quotes 
      (user_id, quote_number, title, client_name, client_attention, items, condiciones, cierre, emisor, subtotal, descuento, igv, total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *`,
      [
        userId,
        quote_number,
        title,
        client_name,
        client_attention || null,
        JSON.stringify(items),
        JSON.stringify(condiciones),
        JSON.stringify(cierre),
        JSON.stringify(emisor),
        subtotal,
        descuento,
        igv,
        total
      ]
    );

    res.status(201).json({
      message: 'Quote created successfully',
      quote: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// PUT update an existing quote
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const {
      title,
      client_name,
      client_attention,
      items,
      condiciones,
      cierre,
      emisor,
      subtotal,
      descuento = 0,
      igv,
      total
    } = req.body;

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM quotes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found or unauthorized' });
    }

    const result = await pool.query(
      `UPDATE quotes 
      SET title = $1, client_name = $2, client_attention = $3, items = $4, condiciones = $5, cierre = $6, emisor = $7, subtotal = $8, descuento = $9, igv = $10, total = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 AND user_id = $13 
      RETURNING *`,
      [
        title,
        client_name,
        client_attention || null,
        JSON.stringify(items),
        JSON.stringify(condiciones),
        JSON.stringify(cierre),
        JSON.stringify(emisor),
        subtotal,
        descuento,
        igv,
        total,
        id,
        userId
      ]
    );

    res.json({
      message: 'Quote updated successfully',
      quote: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// DELETE a quote
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM quotes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found or unauthorized' });
    }

    res.json({
      message: 'Quote deleted successfully',
      quote: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
