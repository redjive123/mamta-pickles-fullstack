const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const isDeployed = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Middlewares
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : null;

app.use(
  cors(
    allowedOrigins
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          },
          credentials: true,
        }
      : { credentials: true }
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    name: 'Mamta Pickles API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Serve built frontend when deployed (Vercel serverless / production)
if (isDeployed) {
  const path = require('path');
  const distDir = path.resolve(__dirname, '../../frontend/dist');

  app.use(express.static(distDir));

  // SPA fallback for non-API routes
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  // Root API Welcome Route (local development only)
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Mamta Pickles API - Authentic Homemade Pickles Store',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        products: '/api/products',
        orders: '/api/orders',
        payments: '/api/payments',
      },
    });
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
