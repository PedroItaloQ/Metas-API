import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // Opcional: configurar logs do Prisma
  constructor() {
    super({
      // log: ['query', 'info', 'warn', 'error'],
    });
  }
}
