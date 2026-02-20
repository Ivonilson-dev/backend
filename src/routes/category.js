const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');

// Get categories
router.get('/', auth, async (req, res) => {
    const { id: userId } = req.user;
    try {
        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category
router.post('/', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { name, type } = req.body;

    try {
        const category = await prisma.category.create({
            data: {
                userId,
                name,
                type
            }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;

    try {
        await prisma.category.deleteMany({
            where: { id, userId }
        });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
