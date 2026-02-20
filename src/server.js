const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const categoryRoutes = require('./routes/category');
const historyRoutes = require('./routes/history');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 3000;

// Only start server if not running as a Vercel function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
