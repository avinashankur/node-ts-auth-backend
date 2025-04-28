import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index';
import errorHandler from './middlewares/errorHandler';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    /*
    When you set credentials true in cors,it allows cross-origin
    requests to include credentials such as:
    Authorization headers: Authorization: Bearer token
    NOTE: You can not use credentials with origin *
  */
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(
  express.urlencoded({
    extended: true, // Makes it possible to give objects inside other objects
    limit: '16kb',
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan('dev'));

// All the routes
app.use('/api/v1/', routes);

app.use(errorHandler);

export default app;
