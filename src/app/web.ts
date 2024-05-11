import express, { Application } from 'express';
import { errorMiddleware } from '../middleware/error-middleware';
import { publicRouter } from '../router/public-api';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { privateRouter } from '../router/private-api';

dotenv.config();
export const webApplicaiton: Application = express();

webApplicaiton.use(express.json());
webApplicaiton.use(cookieParser());
webApplicaiton.use(publicRouter);
webApplicaiton.use(privateRouter);
webApplicaiton.use(errorMiddleware);