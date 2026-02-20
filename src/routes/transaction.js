const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const auth = require('../middleware/auth');

// Get all transactions
router.get('/', auth, async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { startDate, endDate, type } = req.query;

        const where = { userId };

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        if (type) {
            where.type = type;
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: { category: true },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create transaction
router.post('/', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { amount, type, description, date, categoryId } = req.body;

    try {
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount,
                type,
                description,
                date: new Date(date),
                categoryId
            }
        });

        // Create history
        await prisma.history.create({
            data: {
                userId,
                tableName: 'Transaction',
                recordId: transaction.id,
                operation: 'INSERT',
                newData: transaction
            }
        });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { amount, type, description, date, categoryId } = req.body;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId }
        });

        if (!existing) return res.status(404).json({ error: 'Transaction not found' });

        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                amount,
                type,
                description,
                date: new Date(date),
                categoryId
            }
        });

        // History
        await prisma.history.create({
            data: {
                userId,
                tableName: 'Transaction',
                recordId: id,
                operation: 'UPDATE',
                oldData: existing,
                newData: updated
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId }
        });

        if (!existing) return res.status(404).json({ error: 'Transaction not found' });

        await prisma.transaction.delete({ where: { id } });

        // History
        await prisma.history.create({
            data: {
                userId,
                tableName: 'Transaction',
                recordId: id,
                operation: 'DELETE',
                oldData: existing
            }
        });

        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
