import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    // NO tumbamos la app si la BD no está disponible al arrancar (p.ej. Supabase
    // pausado o con la connection string desactualizada). Antes, un fallo aquí
    // hacía que TODO el servicio se cayera y ni siquiera /api/health respondía.
    // En su lugar registramos el error y reintentamos en segundo plano; Prisma
    // también reconecta de forma perezosa en la primera query cuando la BD vuelve.
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log('Conexión a la base de datos establecida.');
    } catch (error) {
      this.logger.error(
        `No se pudo conectar a la BD al iniciar: ${
          (error as Error)?.message ?? error
        }. La app sigue arriba; se reintentará en segundo plano.`,
      );
      this.scheduleReconnect();
    }
  }

  /** Reintenta conectar con backoff exponencial (máx. 30s) hasta lograrlo. */
  private scheduleReconnect(attempt = 1) {
    const delay = Math.min(30_000, 2_000 * 2 ** (attempt - 1));
    setTimeout(() => {
      void this.$connect()
        .then(() => {
          this.connected = true;
          this.logger.log('Conexión a la base de datos restablecida.');
        })
        .catch(() => this.scheduleReconnect(attempt + 1));
    }, delay);
  }

  /** true si Prisma logró conectar al menos una vez (lo usa /health/db). */
  isConnected() {
    return this.connected;
  }
}
