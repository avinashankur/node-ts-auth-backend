import dotenv from 'dotenv';
import app from './app';
import connectDB from '@/config/database';
import logger from './utils/helpers/logger';

dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Serving on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB Connection Failed!!', err);
  });
