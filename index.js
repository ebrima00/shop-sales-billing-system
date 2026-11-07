const express = require('express');

const app = express();

const productRoutes = require('./src/routes/productRoutes');
const salesRoutes = require('./src/routes/salesRoutes');

app.use(express.json());

// Home
app.get('/', (request, response) => {
    response.send('Welcome to Shop Sales and Billing System API');
});

// Product endpoints
app.use('/api/products', productRoutes);

// Sales endpoints
app.use('/api/sales', salesRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});