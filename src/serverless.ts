import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// cache entre cold starts
let cachedApp: INestApplication | null = null;
let cachedServer: express.Express | null = null;

async function bootstrap(): Promise<express.Express> {
  if (cachedServer) return cachedServer;

  const server = express();
  const adapter = new ExpressAdapter(server);

  const app = await NestFactory.create(AppModule, adapter, { logger: ['error','warn','log'] });
  app.enableCors({
    origin: '*', // ajuste para seu domínio do app
    credentials: false,
  });

  await app.init();
  cachedApp = app;
  cachedServer = server;
  return server;
}

// Vercel chama essa função
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
