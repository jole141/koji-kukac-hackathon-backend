import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { initDb } from './database';
import cron from 'node-cron';
import { CronJobs } from './cron-jobs/index.job';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { subscribeToParkingEvents } from '@/consumers/eventHubClient.consumer';

class App {
  public server: any;
  public app: express.Application;
  public io: Server;
  public env: string;
  public port: string | number;
  public scheduledJobs: { [key: string]: cron.ScheduledTask } = {};

  constructor(routes: Routes[]) {
    this.app = express();
    this.io = undefined;
    this.env = NODE_ENV;
    this.port = PORT;

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initializeCronJobs();
  }

  public listen() {
    const server = createServer(this.app);
    this.io = new Server(server);

    this.io.on('connection', socket => {
      logger.info(`Client connected: ${socket.id}`);
    });

    subscribeToParkingEvents(this.io);

    server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} IO =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async initializeDatabase() {
    await initDb();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeCronJobs() {
    for (const jobName of Object.keys(CronJobs)) {
      const job = CronJobs[jobName];
      logger.info(`Scheduling job: ${jobName}, cronTime: ${job.cronTime}`);
      const scheduledJob = cron.schedule(job.cronTime, job.execute);
      this.scheduledJobs[jobName] = scheduledJob;
    }
  }
}

export default App;
