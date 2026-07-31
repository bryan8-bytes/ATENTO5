import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected by JWT token authentication
router.use(authenticateToken);

// GET all orders of the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT id, order_number, provider_name, provider_ruc, provider_address, provider_attention, condiciones, items, firmas, subtotal, igv, total, created_at, updated_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST create a new order
router.post('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      order_number,
      provider_name,
      provider_ruc,
      provider_address,
      provider_attention,
      condiciones,
      items,
      firmas,
      subtotal,
      igv,
      total
    } = req.body;

    if (!order_number || !provider_name || !items || !condiciones) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if order_number already exists
    const duplicateCheck = await pool.query(
      'SELECT id FROM orders WHERE order_number = $1',
      [order_number]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ error: `Order number ${order_number} already exists` });
    }

    const result = await pool.query(
      `INSERT INTO orders 
      (user_id, order_number, provider_name, provider_ruc, provider_address, provider_attention, condiciones, items, firmas, subtotal, igv, total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        userId,
        order_number,
        provider_name,
        provider_ruc || null,
        provider_address || null,
        provider_attention || null,
        JSON.stringify(condiciones),
        JSON.stringify(items),
        JSON.stringify(firmas || {}),
        subtotal,
        igv,
        total
      ]
    );

    res.status(201).json({
      message: 'Order created successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update an existing order
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const {
      provider_name,
      provider_ruc,
      provider_address,
      provider_attention,
      condiciones,
      items,
      firmas,
      subtotal,
      igv,
      total
    } = req.body;

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    const result = await pool.query(
      `UPDATE orders 
      SET provider_name = $1, provider_ruc = $2, provider_address = $3, provider_attention = $4, condiciones = $5, items = $6, firmas = $7, subtotal = $8, igv = $9, total = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND user_id = $12 
      RETURNING *`,
      [
        provider_name,
        provider_ruc || null,
        provider_address || null,
        provider_attention || null,
        JSON.stringify(condiciones),
        JSON.stringify(items),
        JSON.stringify(firmas || {}),
        subtotal,
        igv,
        total,
        id,
        userId
      ]
    );

    res.json({
      message: 'Order updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE an order
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    res.json({
      message: 'Order deleted successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
