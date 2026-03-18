import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit {

  constructor() {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not defined in environment variables');
      throw new Error('DATABASE_URL missing');
    }

    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL, // ← STRING real
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
