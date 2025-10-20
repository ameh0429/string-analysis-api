import express from 'express';
import stringRoutes from './routes/stringRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'This is my Stage 1 task' });
  } )

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/strings', stringRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Error Handler (must be last)
  app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`String Analysis API Server running on port ${PORT}`);
});