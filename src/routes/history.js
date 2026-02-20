const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');

// Get history
router.get('/', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { page = 0, limit = 20 } = req.query;

    try {
        const history = await prisma.history.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            skip: Number(page) * Number(limit),
            take: Number(limit)
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
